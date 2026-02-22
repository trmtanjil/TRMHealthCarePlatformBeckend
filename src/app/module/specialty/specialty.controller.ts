import { Request, Response } from "express";
import { specialityService } from "./specialty.service";

const createSpecialty = async (req:Request, res:Response)=>{
    try{
            const payload = req.body
const result = await specialityService.createSpecialty(payload)
res.status(201).json({
    succes:true,
    message:"specialty create succesfully",
    data:result
})
    }catch(error){
        console.log(error)
        res.status(400).json({
            success:false,
            message:"failed to create specialty",
            error:error
        })
    }
}


const getAllSpecialties = async (req:Request, res:Response)=>{
    try{
const result = await specialityService.getallSpecialties()
res.status(200).json({
    success:true,
    message:"specialties retrieved successfully",
    data:result
})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
        console.log(error)
        res.status(400).json({
            success:false,
            message:"failed to retrieve specialties",
            error:error.message
        })
    }
}
const deleteSpecialty = async (req:Request, res:Response)=>{
    try{
        const {id}= req.params  
        const result = await specialityService.deleteSpecialty(id as string)
        res.status(200).json({
            success:true,
            message:"specialty deleted successfully",
            data:result
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
        console.log(error)
        res.status(400).json({
            success:false,
            message:"failed to delete specialty",
            error:error.message
        })
    }
}

const updateSpecialty = async (req:Request, res:Response)=>{
    try{
        const {id}= req.params
        const payload = req.body
        console.log(id, payload)
        const result = await specialityService.updateSpecialty(id as string, payload)
        res.status(200).json({
            success:true,
            message:"specialty updated successfully",
            data:result
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error:any){
        console.log(error)
        res.status(400).json({
            success:false,
            message:"failed to update specialty",
            error:error.message
        })
    }
}

export const specialityController={
    createSpecialty,
    getAllSpecialties,
    deleteSpecialty,
    updateSpecialty
}