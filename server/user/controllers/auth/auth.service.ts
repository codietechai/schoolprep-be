import {
    TSignupUserToken,
    TUpdateUserPassword,
    TUser,
    TUserToken,
    TUpdateUser,
} from "common/types/user/user.type";
import { UserAuth } from "../../models";

export default class AuthService {
    static async getUserByEmail(email: string) {
        const obj = new UserAuth();
        const response = await obj.getUserByEmail(email);
        return response;
    }

    static async updateRefreshToken(data: TUserToken) {
        const obj = new UserAuth();
        const response = await obj.updateRefreshToken(data);
        return response;
    }

    static async createUser(data: TSignupUserToken) {
        const obj = new UserAuth();
        const response = await obj.createUser(data);
        return response;
    }

    static async editProfile(data: TUser) {
        const obj = new UserAuth();
        const response = await obj.editProfile(data);
        return response;
    }

    static async changePassword(data: TUpdateUserPassword) {
        const obj = new UserAuth();
        const response = await obj.changePassword(data);
        return response;
    }

    static async getUserPassword(id: number) {
        const obj = new UserAuth();
        const response = await obj.getUserPassword(id);
        return response;
    }

    static async getUserById(user_id: number) {
        const obj = new UserAuth();
        const response = await obj.getUserById(user_id);
        return response;
    }

    static async updateUser(data: TUpdateUser, user_id: number) {
        const obj = new UserAuth();
        const response = await obj.updateUser(data, user_id);
        return response;
    }
}
