import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema =z.object( {
    password:z.string("Password is required").min(6,"Password must be at least 6 characters").max(20,"Password must be less than 50 characters"),

    docotor:z.object({
        name:z.string("Name is required").min(3,"Name must be at least 3 characters").max(50,"Name must be less than 50 characters"),

        email:z.string("Email is required"),

        contactNumber:z.string("Contact number is required").min(11,"Contact number must be at least 10 characters").max(15,"Contact number must be less than 15 characters"),

        address:z.string("Address is required").min(10,"Address must be at least 10 characters").max(100,"Address must be less than 100 characters").optional(),

        registrationNumber:z.string("Registration number is required").min(3,"Registration number must be at least 3 characters").max(50,"Registration number must be less than 50 characters"),

        experiance:z.int("Experience is required").nonnegative("Experience must be a non-negative integer").optional(),

        gender:z.enum([Gender.MALE,Gender.FEMALE],"Gender is required and must be one of 'Male','Female'"),  
 
        appointmentFee:z.number("Appointment fee is required").nonnegative("Appointment fee must be a non-negative number") ,

        qualification:z.string("Qualification is required").min(3,"Qualification must be at least 3 characters").max(50,"Qualification must be less than 50 characters"),

        currentWorkplace:z.string("Current workplace is required").min(3,"Current workplace must be at least 3 characters").max(50,"Current workplace must be less than 50 characters"),

        designation:z.string("Designation is required").min(3,"Designation must be at least 3 characters").max(50,"Designation must be less than 50 characters"),

        
        
        
    }),
     specialties:z.array(z.uuid(),"Specialty is required").min(1,"Specialty must be at least 1 characters")
    
    });