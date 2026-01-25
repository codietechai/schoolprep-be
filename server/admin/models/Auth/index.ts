import {
    TAdmin,
    TUpdateAdminToken,
    TUpdateAdminProfile,
    TUpdateAdminPassword,
    TSendVerificationCode,
    TForgotPassword,
    TResetPassword
} from "admin/controllers/auth/auth.types";
import { TUser } from "common/types/user/user.type";
import { User as EndUser } from "server/database/schema";

export class Auth {
    constructor() { }

    public async getUserByEmail(email: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ email });
        return data ? data : null;
    }

    public async updateRefreshToken(data: TUpdateAdminToken): Promise<boolean> {
        await EndUser.updateOne({
            _id: data.user_id,
        }, {
            $set: {
                refresh_token: data.refresh_token,
                last_login_at: data.last_login_at,
                last_login_ip: data.last_login_ip,
                token_status: data.token_status,
            }
        });
        return true;
    }

    public async editProfile(data: TUpdateAdminProfile): Promise<TAdmin | any> {
        const user = await EndUser.updateOne(
            {
                _id: data.user_id,
            },
            {
                full_name: data.full_name,
                contact_number: data.contact_number,
                phone_code: data.phone_code,
                address: data.address,
            }
        );
        return user;
    }
    public async changePassword(data: TUpdateAdminPassword): Promise<boolean> {
        await EndUser.updateOne(
            {
                _id: data.user_id,
            },
            {
                password: data.password,
            }
        );
        return true;
    }

    public async getUserPassword(id: number): Promise<
        | {
            password: string;
        }
        | any
    > {
        const data = await EndUser.findOne({ _id: id });
        return data ? data : null;
    }

    public async sendEmailVerificationCode(
        data: TSendVerificationCode
    ): Promise<boolean> {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 15);
        await EndUser.updateOne(
            {
                _id: data.user_id,
            },
            {
                email_code: data.code,
                email_code_expiry: date,
            }
        );
        return true;
    }

    public async getUserById(user_id: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ _id: user_id }).populate('role').populate('plan_id')
        return data ? data : null;
    }

    public async getUserByrefreshToken(password_reset_code: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ password_reset_code: password_reset_code });
        return data ? data : null;
    }

    public async resetOtp(user_id: string): Promise<TUser | any> {
        await EndUser.updateOne(
            {
                _id: user_id,
            },
            {
                email_code: null,
                email_code_expiry: null,
            }
        );
        return true;
    }

    public async updateForgotPasswordDetails(
        data: TForgotPassword
    ): Promise<boolean> {
        await EndUser.updateOne(
            {
                _id: data.id,
            },
            {
                password_reset_code: data.password_reset_code,
                password_reset_expiry: data.password_reset_expiry,
            }
        );
        return true;
    }

    public async resetPassword(data: TResetPassword): Promise<boolean> {
        await EndUser.updateOne(
            {
                _id: data.id,
            },
            {
                password: data.password,
            }
        );
        return true;
    }
}
