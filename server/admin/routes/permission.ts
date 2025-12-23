import * as express from "express";
import PermissionController from "admin/controllers/permissions/controller";
import { validatePermissionBody } from "admin/controllers/permissions/validation";

const router = express.Router();

const {
    addPermission,
    getPermissions,
    getPermission,
    editPermission,
    deletePermission,
} = PermissionController;

router.post("/add", validatePermissionBody, addPermission);
router.get("/list", getPermissions);
router.get("/get/:id", getPermission);
router.post("/edit/:id", validatePermissionBody, editPermission);
router.delete("/delete", deletePermission);

export default router;
