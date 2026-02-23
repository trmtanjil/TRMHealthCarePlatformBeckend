import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload{
 password: string;
 docotor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkplace?: string;
    designation?: string;   
    
 }   
 specialties:string[]; // স্পেশালিটি গুলোর নামের অ্যারে

} 