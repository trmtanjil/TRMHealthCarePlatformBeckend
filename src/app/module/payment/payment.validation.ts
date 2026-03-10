/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handleStripewebhookEvent = async(event:Stripe.Event) =>{
    const existingPayment = await prisma.payment.findUnique({
        where:{
            stripeEventId:event.id
        }
    })
    if(existingPayment){
        console.log(`Event ${event.id} already prosses . skipping `);
        return {message :`Event ${event.id} already prosses . skipping `};
    }
    switch(event.type){
        case "checkout.session.completed":{
            const session = event.data.object ;
            const paymentId = session.metadata?.paymentId;
            const appointmentId = session.metadata?.appointmentId;

            if(!paymentId || !appointmentId){
                console.log("paymentId or appointmentId not found");
                return {message:"paymentId or appointmentId not found"};
            }
             const appointment = await prisma.appointment.findUnique({
                where:{
                    id:appointmentId
                }
            })
            if(!appointment){
                console.log("appointment not found");
                return {message:"appointment not found"};
            }

            await prisma.$transaction(async(ts)=>{
                await ts.appointment.update({
                    where:{
                        id:appointmentId
                    },
                    data:{
                       paymentStatus:session.payment_status==="paid"?PaymentStatus.PAID:PaymentStatus.UNPAID
                    }
                });
                await ts.payment.update({
                    where:{
                        id:paymentId
                    },
                    data:{
                        stripeEventId:event.id,
                        status:session.payment_status==="paid"?PaymentStatus.PAID:PaymentStatus.UNPAID,
                        paymentGatewayData:session as any
                    }
                });

            });

            console.log(`processed checkout.session.completed for paymentId ${paymentId} and appointmentId ${appointmentId}`);
            break;


        }
        case "checkout.session.expired":{
            const session = event.data.object ;
            console.log(`checkout.session.expired for session ${session.id} and appointmentId ${session.metadata?.appointmentId}`);
            break;
        }
        case "payment_intent.payment_failed":{
            const session = event.data.object ;
            console.log(`payment_intent.payment_failed for session ${session.id} and appointmentId ${session.metadata?.appointmentId}`);
            break;
        }
        default :
           console.log(`unhandled event type ${event.type}`);
    }
    return {message:`webhook event ${event.type} processed successfully`};
}

export const paymentValidation = {
    handleStripewebhookEvent
}