 
import z from "zod";
import { BloodGroup, Gender } from "../../../generated/prisma/enums";

const updatePatientProfileZodSchema  = z.object({
    patientInfo :z.object({
        name:z.string("Name is required").min(3,"Name must be at least 3 characters").max(50,"Name must be less than 50 characters").optional(), 
        profilePhoto:z.string("Profile photo is required").min(3,"Profile photo must be at least 3 characters").max(1000,"Profile photo must be less than 1000 characters").optional(),
        contactNumber:z.string("Contact number is required").min(11,"Contact number must be at least 11 characters").max(14,"Contact number must be at most 15 characters").optional(),
        address:z.string("Address is required").min(3,"Address must be at least 3 characters").max(100,"Address must be less than 100 characters").optional(),

     }).optional(),
    patientHealthData :z.object({
        gender:z.enum([Gender.MALE,Gender.FEMALE,],"Gender is required and must be one of 'Male','Female'").optional(),
        dateOfBirth:z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        }).optional(),
          bloodGroup: z.enum([BloodGroup.A_POSITIVE, BloodGroup.A_NEGATIVE, BloodGroup.B_POSITIVE, BloodGroup.B_NEGATIVE, BloodGroup.AB_POSITIVE, BloodGroup.AB_NEGATIVE, BloodGroup.O_POSITIVE, BloodGroup.O_NEGATIVE]).optional(),
              hasAllergies: z.boolean().optional(),
        hasDiabetes: z.boolean().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        smokingStatus: z.boolean().optional(),
        dietaryPreferences: z.string().optional(),
        pregnancyStatus: z.boolean().optional(),
        mentalHealthHistory: z.string().optional(),
        immunizationStatus: z.string().optional(),
        hasPastSurgeries: z.boolean().optional(),
        recentAnxiety: z.boolean().optional(),
        recentDepression: z.boolean().optional(),
        maritalStatus: z.string().optional(),

    }).optional(),
    
    medicalReports :z.array(z.object({
         shouldDelete : z.boolean().optional(),
        reportId : z.uuid().optional(),
        reportName : z.string().optional(),
        reportLink : z.url().optional(),
    })).optional().refine((reports) => {
              if(!reports || reports.length === 0) return true; // If no reports, it's valid

        
        for (const report of reports) {

            // case-1
            if(report.shouldDelete === true && !report.reportId) {
                return false; // If shouldDelete is true, reportId must be provided
            }

            // case-2
            if(report.reportId && !report.shouldDelete) {
                return false; // If reportId is provided, shouldDelete must be true
            }

            //case-3
            if(report.reportName && !report.reportLink) {
                return false; // If reportName is provided, reportLink must also be provided
            }

            //case-4
            if(report.reportLink && !report.reportName) {
                return false; // If reportLink is provided, reportName must also be provided
            }

        }
        return true;
    },{
        message:"Invalid report format"
    }),
})

export const PatientValidation = {
    updatePatientProfileZodSchema
}