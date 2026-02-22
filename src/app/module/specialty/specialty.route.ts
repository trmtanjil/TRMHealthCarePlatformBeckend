import { Router } from "express";
import { specialityController } from "./specialty.controller";

const router = Router()

router.post("/",specialityController.createSpecialty);
router.get("/",specialityController.getAllSpecialties);
router.delete("/:id",specialityController.deleteSpecialty);
router.patch("/:id",specialityController.patchSpecialty);

export const  SpecialtyRoutes =router