import * as express from "express";
import AuthController from "admin/controllers/auth/auth.controller";
import * as AuthValidation from "../controllers/auth/auth.validation";
import { auth } from "admin/middlewares";

const router = express.Router();

const { validateLoginAdminBody, validateUpdateProfileBody, validateChangePasswordBody, validateTwoFaAdminBody, validateForgotPasswordBody, validateResetPasswordBody, validateSignupAdminBody } = AuthValidation;
const { login, logout, editProfile, changePassword, verifyEmailOtp, resendEmailOtp, forgotPassword, resetPassword, signup,getAccessTokenThroughRefreshToken } = AuthController;

router.post("/login", validateLoginAdminBody, login);
router.post("/logout", auth, logout);
router.post("/signup", validateSignupAdminBody, signup);
router.post("/2fa-login", validateTwoFaAdminBody, verifyEmailOtp);
router.post("/resend-code/:user_id", resendEmailOtp);
router.post("/edit-profile", auth, validateUpdateProfileBody, editProfile);
router.post("/change-password", auth, validateChangePasswordBody, changePassword);
router.post("/forgot-password", validateForgotPasswordBody, forgotPassword);
router.post("/reset-password", validateResetPasswordBody, resetPassword);
router.post("/get-access-token", getAccessTokenThroughRefreshToken);
export default router;
