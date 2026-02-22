import { Request, Response } from "express";
import { specialityService } from "./specialty.service";

const createSpecialty = async (req:Request, res:Response)=>{
    const payload = req.body
const result = await specialityService.createSpecialty(payload)
res.status(201).json({
    succes:true,
    message:"specialty create succesfully",
    data:result
})
}

export const specialityController={
    createSpecialty
}