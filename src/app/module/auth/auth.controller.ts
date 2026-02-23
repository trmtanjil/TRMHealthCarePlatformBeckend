import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authServices } from "./auth.services";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerPatient = catchAsync(
    async (req:Request, res:Response) => {
        const payload = req.body;

        const result = await authServices.registerPatient(payload);

         sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: result
        })
})


const loginUser = catchAsync(
    async (req:Request, res:Response) => {
        const payload = req.body;
        
 
        const result = await authServices.loginUser(payload); 
        
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: result
        })
})

export const authController = {
    registerPatient,
    loginUser
}