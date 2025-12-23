import * as express from "express";
import UserController from "admin/controllers/users/user.controller";
import {
    validateListUserQuery,
    validateUserBody,
} from "admin/controllers/users/user.validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
    addUser,
    getUsers,
    getUser,
    editUser,
    deleteUser
} = UserController;

router.get("/list",authorize('user',"read"), validateListUserQuery, getUsers);
router.get("/get/:id",authorize('user',"read"), getUser);
router.post("/add",authorize('user',"create"),validateUserBody, addUser);
router.put("/edit/:id",authorize('user',"update"), validateUserBody, editUser);
router.delete("/delete",authorize('user',"delete"), deleteUser);

export default router;
