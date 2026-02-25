import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { authRoute } from "../module/auth/auth.route";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router()

router.use("/auth", authRoute)  

router.use("/specialties",SpecialtyRoutes)
router.use("/users", userRoutes)
router.use("/doctors", doctorRoutes)
router.use("/admins", AdminRoutes)

export const IndexRoutes = router