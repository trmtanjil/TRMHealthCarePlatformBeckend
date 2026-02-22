/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { specialityService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";

const createSpecialty = catchAsync(async (req:Request, res:Response)=>{
    const payload = req.body
    const result = await specialityService.createSpecialty(payload)
    res.status(201).json({
        success:true,
        message:"specialty created successfully",
        data:result
    })
}
)



const getAllSpecialties =  catchAsync(async (req:Request, res:Response)=>{
const result = await specialityService.getallSpecialties()
res.status(200).json({
    success:true,
    message:"specialties fetched successfully",
    data:result
})
}
)

const deleteSpecialty =  catchAsync(async (req:Request, res:Response)=>{
    const {id}= req.params
    const result = await specialityService.deleteSpecialty(id as string)
    res.status(200).json({
        success:true,
        message:"specialty deleted successfully",
        data:result
    })  
})

const updateSpecialty = catchAsync(async (req:Request, res:Response)=>{
        const {id}= req.params
        const payload = req.body
        console.log(payload)
         const result = await specialityService.updateSpecialty(id as string, payload)
        res.status(200).json({
            success:true,
            message:"specialty updated successfully",
            data:result
        })
    } 
)
export const specialityController={
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    updateSpecialty
}