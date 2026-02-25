 import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
 
interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
    userId: string;
}

const registerPatient = async (payload:RegisterPatientPayload) => {
    const {name, email, password} = payload;

    const data = await auth.api.signUpEmail({
        body:{
            name,
            email,
            password,
            //default values for the additional fields defined in better-auth configuration
            // needPasswordChange: false,
            // role: Role.PATIENT
        }
    })
    if(!data.user){
        // throw new Error("Failed to register patient");
        throw new AppError(status.BAD_REQUEST,"Failed to register patient") 
    }

    //create patient profile transection after signup patint of user
  try{
  const patient = await prisma.$transaction(async (tx) => {
      const patientTx=   await tx.patient.create({
            data:{
                userId: data.user.id ,
                name:payload.name,
                email:payload.email,
             }
            })
            return patientTx;
        } )

            const accessToken = tokenUtils.getAccesToken({
        userId : data.user.id,
        role :data.user.role,
        name:data.user.name,
        email:data.user.email,
        status:data.user.status,
        isDelate:data.user.isDeleted,
        emailVarified:data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId : data.user.id,
        role :data.user.role,
        name:data.user.name,
        email:data.user.email,
        status:data.user.status,
        isDelate:data.user.isDeleted,
        emailVarified:data.user.emailVerified
    });

        return {...data, 
             patient,
            accessToken,
            refreshToken}

  }catch(error){
    console.log("transection error",error)
    await prisma.user.delete({
        where:{
            id:data.user.id
        }
    })
    throw error;
    }

}

interface LoginUserPayload {
    email: string;
    password: string;
}

const loginUser= async(payload:LoginUserPayload) => {
    const {email, password} = payload;
    const data= await auth.api.signInEmail({
        body:{
            email,
            password
        }
    })
    if(data.user.status ===UserStatus.BLOCKED){
        throw new AppError(status.FORBIDDEN,"Your account is blocked. Please contact support.");
    }
    if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND,"Your account has been deleted. Please contact support.");
    }

    const accessToken = tokenUtils.getAccesToken({
        userId : data.user.id,
        role :data.user.role,
        name:data.user.name,
        email:data.user.email,
        status:data.user.status,
        isDelate:data.user.isDeleted,
        emailVarified:data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
        userId : data.user.id,
        role :data.user.role,
        name:data.user.name,
        email:data.user.email,
        status:data.user.status,
        isDelate:data.user.isDeleted,
        emailVarified:data.user.emailVerified
    });

    return {
        ...data,
        accessToken,
        refreshToken
    }
}

const getMe = async(user:IRequestUser)=>{
    const isUserExist = await prisma.user.findUnique({
        where:{
            id:user.userId
        },
        include:{
            patient:{
                include:{
                    appointments:true,
                    reviews:true,
                    patientHealthData:true,
                    prescriptions:true,
                    medicalReports:true
                }
            },
            doctor:{
                include:{
                    specialties:true,
                    appointments:true,
                    reviews:true,
                    prescriptions:true
                }
            },
            admin:{}
        }
    })
    if(!isUserExist){
        throw new AppError(status.NOT_FOUND, "user not found")
    }
    return isUserExist
}

export const authServices = {
    registerPatient,
    loginUser,
    getMe
}