import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { authRoute } from "../module/auth/auth.route";

const router = Router()

router.use("/auth", authRoute)  

router.use("/specialties",SpecialtyRoutes)

export const IndexRoutes = router