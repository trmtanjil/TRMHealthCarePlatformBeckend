import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";
 
const getAllDoctors = catchAsync(
    async (req:Request, res:Response) => {

        const result = await doctorService.getAllDoctors();

            sendResponse(res,{
                httpStatusCode: status.OK,
                success:true,
                message:"Doctors retrieved successfully",
                data:result 
            })
})

const getDoctorById = catchAsync(
    async (req:Request, res:Response) => {
        const {id} = req.params;
        const result = await doctorService.getDoctorById(id as string);   
        sendResponse(res,{
            httpStatusCode: status.OK,
            success:true,
            message:"Doctor retrieved successfully",
            data:result 
        })
})

export const doctorController = {
    getAllDoctors,
    getDoctorById
}   