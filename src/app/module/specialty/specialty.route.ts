/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialityController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequst } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";
  
const router = Router()

router.post("/",
    //  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequst(SpecialtyValidation.createSpecialtyZodSchema),
    specialityController.createSpecialty
   
);
router.get("/",checkAuth(Role.PATIENT),specialityController.getAllSpecialties);
router.delete("/:id",specialityController.deleteSpecialty);
router.patch("/:id",specialityController.updateSpecialty);

export const  SpecialtyRoutes =router