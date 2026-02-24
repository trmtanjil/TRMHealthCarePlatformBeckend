import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";
import AppError from "../../errorHelpers/AppError";
 
const createDoctor = async (payload: ICreateDoctorPayload) => {
const specialties : Specialty[]=[]

for(const specialityId of payload.specialties){
    const speciality = await prisma.specialty.findUnique({
        where:{
            id: specialityId
        }
    })
if(!speciality){
    throw new AppError(status.NOT_FOUND,`Speciality with id ${specialityId} not found`);
} 
specialties.push(speciality)
}

const userExists = await prisma.user.findUnique({
    where:{
        email: payload.docotor.email
    }
})
if(userExists){
    throw new AppError(status.CONFLICT,`User with email ${payload.docotor.email} already exists`);
}

const userData = await auth.api.signUpEmail({
    body:{
        email: payload.docotor.email,
        password: payload.password,
        name: payload.docotor.name,
        role:Role.DOCTOR,
        needPasswordChange: true
    }
})


try{
const result = await prisma.$transaction(async(tx)=>{

    const doctorData = await tx.doctor.create({
        data:{
            userId: userData.user.id,
            ...payload.docotor,
        }
    })
    const doctorSpecialtiesData = specialties.map((specialty)=>{
        return{
            doctorId: doctorData.id,
            specialtyId: specialty.id
        }
    })
    await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData
    })

    const doctor = await tx.doctor.findUnique({
        where:{
            id: doctorData.id
        },
        select:{
            id: true,
            name: true,
            email: true,    
            profilePhoto: true,
            contactNumber: true,
            address: true,
            registrationNumber: true,
            experience: true,
            gender: true,
            appointmentFee: true,
            qualification: true, 
            currentWorkplace: true,
            designation: true,
            createdAt: true,
            updatedAt: true,
            user:{
                select:{
                    id: true,
                    email: true,
                    name: true,
                    role: true,  
                    emailVerified: true ,
                    image: true,
                    isDeleted: true,
                    deletedAt: true,
                    createdAt: true,
                    updatedAt: true

                }
            },
            specialties:{
                select:{
                    specialty:{
                        select:{
                            title: true,
                            id: true
                        }
                    }
                }
            }   

        }
    })

    return doctor

})
return result
}catch(error){
    console.log("transection error :",error);
    await prisma.user.delete({
        where:{
            id: userData.user.id
        }
    })
}


}

export const UserService = {
    createDoctor
}