import { Router } from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";
import { authRoute } from "../module/auth/auth.route";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import { AppointmentRoutes } from "../module/appointment/appointment.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";

const router = Router()
 router.use("/auth", authRoute)  

router.use("/specialties",SpecialtyRoutes)
router.use("/users", userRoutes)
router.use("/doctors", doctorRoutes)
router.use("/admins", AdminRoutes)

router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
router.use("/appointments", AppointmentRoutes)


export const IndexRoutes = router