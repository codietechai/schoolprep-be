import * as express from "express";
import { auth } from "../middlewares";
import {
    validateSignupUserBody,
} from "../controllers/auth/auth.validation";
import AuthController from "../controllers/auth/auth.controller";

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
