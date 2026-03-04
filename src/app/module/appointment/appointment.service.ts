import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma"
import { IBookAppointmentPayload } from "./appointment.interface"
import { v7 as uuidv7 } from "uuid";
 

// Pay Now Book Appointment
const bookAppointment = async (payload:IBookAppointmentPayload,user:IRequestUser) => {
   const patientData = await prisma.patient.findFirstOrThrow({
    where:{
        email:user.email
    }
   });
   const doctorData = await prisma.doctor.findFirstOrThrow({
    where:{
        id:payload.doctorId,
        isDeleted:false
    }
   })
   const scheduleData = await prisma.schedule.findFirstOrThrow({
    where:{
        id:payload.scheduleId,
    }
   })

    
      const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where : {
        doctorId_scheduleId:{
            doctorId : doctorData.id,
            scheduleId : scheduleData.id,   
        }
    }
   });
       const videoCallingId = String(uuidv7());
  
       const result = await prisma.$transaction(async (tx) => {
           const appointmentData = await tx.appointment.create({
               data:{
                doctorId:doctorData.id,
                patientId:patientData.id,
                scheduleId:doctorSchedule.scheduleId,
                videoCallingId,
        
               }
           });
           await tx.doctorSchedules.update({
               where : {
                  doctorId_scheduleId : {
                      doctorId :payload.scheduleId,
                      scheduleId : payload.scheduleId

                  }
               },
               data : {
                   isBooked : true
               }
               
           })
           // payment interegration will be heare
           return appointmentData
       })

       return result
 
}

const getMyAppointments = async ( ) => {
  

}

// 1. Completed Or Cancelled Appointments should not be allowed to update status
// 2. Doctors can only update Appoinment status from schedule to inprogress or inprogress to complted or schedule to cancelled.
// 3. Patients can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress. 
// 4. Admin and Super admin can update to any status.

const changeAppointmentStatus = async () => {
    
}

// refactoring on include of doctor and patient data in appointment details, we can use query builder to get the data in single query instead of multiple queries in case of doctor and patient both
const getMySingleAppointment = async ( ) => {
 
}

// integrate query builder
const getAllAppointments = async () => {
   
}  


const bookAppointmentWithPayLater = async ( ) => {
 
}  

const initiatePayment = async ( ) => {
   
}

const cancelUnpaidAppointments = async () => {
  
}



export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments,
}