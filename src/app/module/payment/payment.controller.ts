/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { envVars } from "../../config/env";
import status from "http-status";
import { stripe } from "../../config/stripe.config";
import { paymentService } from "./payment.service";
import { ht } from "date-fns/locale";
import { sendResponse } from "../../shared/sendResponse";

const handleStripewebhookEvent =catchAsync(async (req:Request, res:Response) => {
    const signature = req.headers['stripe-signature']
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOKE_SECRET

    if(!signature || !webhookSecret){
       console.error("Stripe webhook signature or webhook secret not found");
       return res.status(status.BAD_REQUEST).json({success:false, message:"Stripe webhook signature or webhook secret not found"});
    }

    let event;

    try {
        event = await stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error : any) {
        console.error("Error verifying Stripe webhook:", error);
        return res.status(status.BAD_REQUEST).json({success:false, message:"Error verifying Stripe webhook"});
    }
    try{
        const result = await paymentService.handleStripewebhookEvent(event);
        sendResponse (res,{
            httpStatusCode: status.OK,
            success:true,
            message:"Stripe webhook processed successfully",
            data:result
        })
    }catch(error:any){
        console.error("Error processing Stripe webhook:", error);
        return res.status(status.BAD_REQUEST).json({success:false, message:"Error processing Stripe webhook"});
    }
})

export const paymentController = {
    handleStripewebhookEvent
}