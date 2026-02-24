import z from "zod";
import { TerrorResponse,  TErrorSource } from "../interfaces/error.interfaces";
import status from "http-status";

export const handleZodError = (err:z.ZodError):TerrorResponse => {
 const  statusCode = status.BAD_REQUEST;
   const  message = " zod Validation error";
   const errorsource:TErrorSource[] = []

        err.issues.forEach((issue)=>{
            errorsource.push({
                path: issue.path.join(" => ") || "unknown",
                message: issue.message
            })
        })
        return{
            success:false,
            message,
            errorSources:errorsource,
            statusCode
         
        }
}