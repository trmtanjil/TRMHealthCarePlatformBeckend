 import { auth } from "../../lib/auth";
 
interface RegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload:RegisterPatientPayload) => {
    const {name, email, password} = payload;
    // Example logic for registering a patient
    console.log("Registering patient:", name, email);
    // Here you would typically interact with your database to create a new user record

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

export const authServices = {
    registerPatient
}