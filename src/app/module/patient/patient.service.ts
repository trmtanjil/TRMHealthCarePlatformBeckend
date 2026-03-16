import { he } from "zod/locales";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IUpdatePatientHealthDataPayload, IUpdatePatientProfilePayload } from "./patient.interface";
import { convertDateTime } from "./patient.utils";
 

const updateMyProfile = async(user:IRequestUser,payload:IUpdatePatientProfilePayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        },
        include: {
            patientHealthData: true,
            medicalReports: true
        }
    })
    const result = await prisma.$transaction(async(tx)=>{
        if(payload.patientInfo){
            await tx.patient.update({
                where: {
                    id: patientData.id
                },
                data: payload.patientInfo
            });
            if(payload.patientInfo.name || payload.patientInfo.profilePhoto ){
                const userData = {
                    name: payload.patientInfo.name ?payload.patientInfo.name : patientData.name,
                    image: payload.patientInfo.profilePhoto ?payload.patientInfo.profilePhoto : patientData.image,    
                }
                await tx.user.update({
                    where: {
                        id: patientData.id
                    },
                    data:{ ...userData}
                });
            };
            if(payload.patientHealthData){
                const healthDataToSave:IUpdatePatientHealthDataPayload = {
                    ...payload.patientHealthData,
                }
                if(payload.patientHealthData.dateOfBirth){
                    healthDataToSave.dateOfBirth = convertDateTime(
                        typeof healthDataToSave.dateOfBirth==='string' ?
                        healthDataToSave.dateOfBirth : undefined)
                }
            }
        }
    })
}