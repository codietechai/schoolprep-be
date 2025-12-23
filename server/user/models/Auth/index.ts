const { Op } = require("sequelize");
import {
    TUpdateUserPassword,
    TUser,
    TUserToken,
    TUpdateUser,
} from "common/types/user/user.type";
import { User as EndUser } from "database/schema";

export class UserAuth {
    constructor() { }

    public async getUserByEmail(email: string): Promise<TUser | any> {
        const data = await EndUser.findOne({ email });
        return data ?? null;
    }

    public async updateRefreshToken(data: TUserToken): Promise<boolean> {
        await EndUser.updateOne({
            _id: data.id,
        },
            {
                refresh_token: data.refresh_token,
                last_login_at: data.last_login_at,
                last_login_ip: data.last_login_ip,
            }
        );
        return true;
    }

    public async createUser(data: TUser): Promise<TUser> {
        const res = await EndUser.create(data);
        return res;
    }

    public async editProfile(data: TUser): Promise<TUser | any> {
        const user = await EndUser.updateOne(
            {
                _id: data.id,
            },
            {
                email: data.email,
                full_name: data.full_name,
                contact_number: data.contact_number,
                phone_code: data.phone_code,
            }
        );
        return user;
    }
    public async changePassword(data: TUpdateUserPassword): Promise<boolean> {
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

    public async getUserPassword(id: number): Promise<
        | {
            password: string;
        }
        | any
    > {
        const data = await EndUser.findOne({ _id: id });
        return data ? data : null;
    }

    public async getUserById(user_id: number): Promise<TUser | any> {
        const data = await EndUser.findOne({ _id: user_id });
        return data ?? null;
    }

    public async updateUser(
        data: TUpdateUser,
        user_id: number
    ): Promise<boolean> {
        await EndUser.updateOne(
            {
                _id: user_id,
            },
            data
        );
        return true;
    }
}
