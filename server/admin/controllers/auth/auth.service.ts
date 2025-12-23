import { Auth } from "admin/models";
import {
    TUpdateAdminToken,
    TUpdateAdminProfile,
    TUpdateAdminPassword,
    TSendVerificationCode,
    TForgotPassword,
    TResetPassword
} from "./auth.types";
import { sendOtpCodeEmail } from "../../../helpers";

export default class AuthService {

    static async getUserByEmail(email: string) {
        const obj = new Auth();
        const response = await obj.getUserByEmail(email);
        return response;
    }
    static async updateRefreshToken(data: TUpdateAdminToken) {
        const obj = new Auth();
        const response = await obj.updateRefreshToken(data);
        return response;
    }

    static async editProfile(data: TUpdateAdminProfile) {
        const obj = new Auth();
        const response = await obj.editProfile(data);
        return response;
    }

    static async changePassword(data: TUpdateAdminPassword) {
        const obj = new Auth();
        const response = await obj.changePassword(data);
        return response;
    }

    static async getUserPassword(id: number) {
        const obj = new Auth();
        const response = await obj.getUserPassword(id);
        return response;
    }

    static async sendEmailVerificationCode(data: TSendVerificationCode) {
        const obj = new Auth();
        const response = await obj.sendEmailVerificationCode(data);
        await sendOtpCodeEmail(data.email, data.code.toString(), data.full_name);
        return response;
    }

    static async getUserById(user_id: string) {
        const obj = new Auth();
        const response = await obj.getUserById(user_id);
        return response;
    }

    static async getUserByrefreshToken(password_reset_code: string) {
        const obj = new Auth();
        const response = await obj.getUserByrefreshToken(password_reset_code);
        return response;
    }

    static async resetOtp(user_id: string) {
        const obj = new Auth();
        const response = await obj.resetOtp(user_id);
        return response;
    }

    static async updateForgotPasswordDetails(data: TForgotPassword) {
        const obj = new Auth();
        const response = await obj.updateForgotPasswordDetails(data);
        return response;
    }

    static async resetPassword(data: TResetPassword) {
        const obj = new Auth();
        const response = await obj.resetPassword(data);
        return response;
    }
}
