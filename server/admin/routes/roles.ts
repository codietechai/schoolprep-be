import * as express from "express";
import RoleController from "admin/controllers/roles/controller";
import { validateRoleBody } from "admin/controllers/roles/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const { addRole, getRoles, getRole, editRole, deleteRole } = RoleController;

router.post("/add",authorize('role',"create"), validateRoleBody, addRole);
router.get("/list",authorize('role',"read"), getRoles);
router.get("/get/:id",authorize('role',"read"), getRole);
router.post("/edit/:id",authorize('role',"update"), validateRoleBody, editRole);
router.delete("/delete",authorize('role',"delete"), deleteRole);

export default router;
