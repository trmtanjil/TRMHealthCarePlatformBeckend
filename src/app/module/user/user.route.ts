import {    Router } from "express";
import { userController } from "./user.controller";
 import { validateRequst } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./userValidation";



const router = Router()


 
router.post("/create-doctor",
validateRequst(createDoctorZodSchema)

//     (req:Request,res:Response,next:NextFunction)=>{
//     const parsedResult = createDoctorZodSchema.safeParse(req.body)
 
//     if(!parsedResult.success){
//         next(parsedResult.error)
//     }
//     //senitizing the data
//     req.body = parsedResult.data
//     next()
 
// }

, userController.createDoctor)

export const userRoutes = router