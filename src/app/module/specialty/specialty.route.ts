/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { specialityController } from "./specialty.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
  
const router = Router()

router.post("/",specialityController.createSpecialty);
router.get("/",checkAuth(Role.PATIENT),specialityController.getAllSpecialties);
router.delete("/:id",specialityController.deleteSpecialty);
router.patch("/:id",specialityController.updateSpecialty);

export const  SpecialtyRoutes =router