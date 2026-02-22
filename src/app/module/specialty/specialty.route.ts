import { Router } from "express";
import { specialityController } from "./specialty.controller";

const router = Router()

router.post("/",specialityController.createSpecialty);

export const  SpecialtyRoutes =router