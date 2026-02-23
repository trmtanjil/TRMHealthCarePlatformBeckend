import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { authRoute } from "../module/auth/auth.route";
import { userRoute } from "../module/user/user.route";

const router = Router()

router.use("/auth", authRoute)  

router.use("/specialties",SpecialtyRoutes)
router.use("/doctor", userRoute)

export const IndexRoutes = router