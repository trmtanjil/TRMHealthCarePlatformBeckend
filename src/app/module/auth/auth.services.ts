 import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
 
interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
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
        throw new Error("Failed to register patient");
    }

    //create patient profile transection after signup patint of user
    // const patient = await prisma.$transaction(async (tx) => {
        
    // } 

    return data
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
        throw new Error("Your account is blocked. Please contact support.");
    }
    if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
        throw new Error("Your account has been deleted. Please contact support.");
    }
    return data
}

export const authServices = {
    registerPatient,
    loginUser
}