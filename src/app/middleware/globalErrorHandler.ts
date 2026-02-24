/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import status from "http-status/cloudflare";
import z from "zod";
import { env } from "node:process";
import { TerrorResponse, TErrorSource } from "../interfaces/error.interfaces";
import { handleZodError } from "../errorHelpers/handleZodError";
 



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler =  (err:any, req:Request, res:Response,next:NextFunction) => {

    if(envVars.NODE_ENV === "development"){
        console.log("error from glovel error handler", err)
    }

    let errorSources:TErrorSource[] = []
    let statusCode:number = status.INTERNAL_SERVER_ERROR;
    let message:string = err.message || "Something went wrong";

    if(err instanceof z.ZodError){
        const simplifiedError = handleZodError(err)

        
        statusCode = simplifiedError.statusCode as number;
        message =simplifiedError.message;

        errorSources =[...simplifiedError.errorSources]

        err.issues.forEach((issue)=>{
            errorSources.push({
                path: issue.path.join(" => ") || "unknown",
                message: issue.message
            })
        })
    }

    const errorResponse:TerrorResponse = {
        success:false,
        message,
         errorSources,
        error:envVars.NODE_ENV === "development" ? err : undefined
    }

res.status(statusCode).json(errorResponse)
}