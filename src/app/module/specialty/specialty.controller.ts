/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { specialityService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpecialty = catchAsync(async (req:Request, res:Response)=>{
    const payload = req.body
    const result = await specialityService.createSpecialty(payload)
    sendResponse(res,{
        httpStatusCode:201,
        success:true,   
        message:"specialty created successfully",
        data:result
    })
}
)



const getAllSpecialties =  catchAsync(async (req:Request, res:Response)=>{
const result = await specialityService.getallSpecialties()
sendResponse(res,{
    httpStatusCode:200,
    success:true, 
    message:"specialties retrieved successfully",
    data:result 
})
}
)

const deleteSpecialty =  catchAsync(async (req:Request, res:Response)=>{
    const {id}= req.params
    const result = await specialityService.deleteSpecialty(id as string)
     sendResponse(res,({
    httpStatusCode:200,
    success:true,
    message:"specialty deleted successfully",
    data:result}))  
     
})

const updateSpecialty = catchAsync(async (req:Request, res:Response)=>{
        const {id}= req.params
        const payload = req.body
        console.log(payload)
         const result = await specialityService.updateSpecialty(id as string, payload)
        sendResponse(res,{
            httpStatusCode:200,
            success:true,   
            message:"specialty updated successfully",
            data:result
        })
})
export const specialityController={
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    updateSpecialty
}