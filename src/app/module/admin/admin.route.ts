import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
 import { AdminController } from "./admin.controller";
import { updateAdminZodSchema } from "./admin.validation";
import { validateRequst } from "../../middleware/validateRequest";

const router = Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAllAdmins);
router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    AdminController.getAdminById);
router.patch("/:id",
    checkAuth(Role.SUPER_ADMIN,Role.ADMIN),
    validateRequst(updateAdminZodSchema), AdminController.updateAdmin);
router.delete("/:id",
     
    AdminController.deleteAdmin);

export const AdminRoutes = router;