import * as express from "express";
import AuthController from "user/controllers/auth/auth.controller";
import { auth } from "../middlewares";
import {
    validateSignupUserBody,
} from "user/controllers/auth/auth.validation";

const router = express.Router();

const {
    login,
    signup,
    editProfile,
    updateUser
} = AuthController;

router.post("/login", login);
router.post("/signup", validateSignupUserBody, signup);
router.post("/edit-profile", auth, editProfile);
// router.post("/update", auth, validateUpdateUserBody, updateUser);

export default router;
