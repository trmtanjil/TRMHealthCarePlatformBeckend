 import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
 import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload, LoginUserPayload, RegisterPatientPayload } from "./auth.interfech";
  


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


const getNewToken = async(refreshToken:string, sessionToken:string)=>{

    const isSessionTokenExist = await prisma.session.findUnique({
        where:{
            token:sessionToken
        },
        include:{
            user:true
        }
    })
     
    if (!isSessionTokenExist){
        throw new AppError(status.UNAUTHORIZED,"invelid session token")
    }

    const {token} = await prisma.session.update({
        where:{
            token:sessionToken
        },
        data:{
            token:sessionToken,
            expiresAt:new Date(Date.now()+60*60*60*24*1000),
            updatedAt:new Date()
        }
    })

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET);

    if(!verifiedRefreshToken.message && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED,"Invelide refresh token");
    };
    const data = verifiedRefreshToken.data as JwtPayload


       const newaccessToken = tokenUtils.getAccesToken({
        userId : data.userId,
        role :data.role,
        name:data.name,
        email:data.email,
        status:data.status,
        isDelate:data.isDeleted,
        emailVarified:data.emailVerified
    });
    const newrefreshToken = tokenUtils.getRefreshToken({
        userId : data.id,
        role :data.role,
        name:data.name,
        email:data.email,
        status:data.status,
        isDelate:data.isDeleted,
        emailVarified:data.emailVerified
    });
    return {
        accessToken :newaccessToken,
        refreshToken:newrefreshToken,
        sessionToken:token
    }
    
}

const changePassword = async(payload:IChangePasswordPayload,sessionToken :string)=>{
    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })
    if(!session){
        throw new AppError(status.UNAUTHORIZED,"session token is invelide")
    }

    const {currentPassword, newPassword}=payload;

    const result = await auth.api.changePassword({
        body:{
            currentPassword,
            newPassword,
            revokeOtherSessions:true
        },
        headers:new Headers({
            Authorization :`Bearer ${sessionToken}`
        })
    })

    if(session.user.needPasswordChange){
        await prisma.user.update({
            where:{
                id:session.user.id,
            },
            data:{
                needPasswordChange:false
            }
        })
    }

      const accessToken = tokenUtils.getAccesToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    return {
        ...result,
        accessToken,
        refreshToken
    }

}
 
const logOutUser = async(sessionToken : string)=>{
const result = await auth.api.signOut({
    headers:new Headers({
        Authorization :`Bearer ${sessionToken}`
    })
})
return result;

}
  
 const verifyEmail = async (email:string, otp:string)=>{
    const result = await auth.api.verifyEmailOTP({
        body:{
            email,
            otp
        }
    })
    if(result.status && !result.user.emailVerified){
        await prisma.user.update({
            where:{
                email,
            },
            data:{
                emailVerified:true
            }
        })
    }
 }


const forgetPassword = async (email : string) => {
    const isUserExist = await prisma.user.findUnique({
        where : {
            email,
        }
    })

    if(!isUserExist){
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if(!isUserExist.emailVerified){
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }

    if(isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND, "User not found"); 
    }

    await auth.api.requestPasswordResetEmailOTP({
        body:{
            email,
        }
    })
}

const resetPassword = async (email : string, otp : string, newPassword : string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }

    if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

   await auth.api.resetPasswordEmailOTP({
    body: {
        email,
        otp,
        password: newPassword,
     }
})

    if (isUserExist.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: isUserExist.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    await prisma.session.deleteMany({
        where:{
            userId : isUserExist.id,
        }
    })
}
export const authServices = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword
}