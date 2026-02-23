import { Request, Response } from "express";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { UserService } from "./user.service";
import { catchAsync } from "../../shared/catchAsync";

const createDoctor = catchAsync(async(req:Request, res:Response)=>{
    const payload = req.body
    const result = await UserService.createDoctor(payload)

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
})

export const userController = {
    createDoctor
}               
 