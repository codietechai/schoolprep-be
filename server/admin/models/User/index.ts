const { Op } = require("sequelize");
import { TUser, TUsersList } from "common/types/user/user.type";
import { User as EndUser } from "database/schema";

export class User {
    constructor() { }
    public async getUsers(filters: any): Promise<TUsersList | any> {
        const where = {
            email: { $regex: new RegExp(filters.search, 'i') },
        };

        let colName = filters?.sorting ? filters.sorting[0] : '';
        if (colName === 'id') {
            colName = '_id';
        }
        let sortObj = {};
        if (filters.sorting) {
            sortObj = { [colName]: filters.sorting[1] === 'ASC' ? 1 : -1 };
        }

        const total = await EndUser.countDocuments(where);
        const data = await EndUser.find(where)
            .skip(filters.offset)
            .limit(filters.limit).populate('role')
            .sort(sortObj);

        return { total, data };
    }

    public async addUser(data: TUser): Promise<TUser | any> {
        const res = await EndUser.create({ ...data, registration_date: new Date() });
        return res;
    }

    public async updateUser(id: string, data: TUser): Promise<TUser | any> {
        const res = await EndUser.updateOne({
            _id: id,
        }, data);
        return res;
    }

    public async editUser(id: string, data: TUser): Promise<TUser | any> {
        const res = await EndUser.updateOne({
            _id: id,
        }, data);
        return res;
    }

    public async getUserById(id: number): Promise<TUser | any> {
        const data = await EndUser.findById(id);
        return data ? data : null;
    }

    public async getUsersById(id: number[]): Promise<TUser[] | any> {
        const data = await EndUser.find({
            _id: id,
        });
        return data ?? null;
    }

    public async deleteUser(ids: number[]): Promise<number> {
        const response = await EndUser.deleteMany({
            _id: ids,
        });
        return response;
    }

    public async editProfile(
        id: number | string,
        data: TUser
    ): Promise<boolean> {
        await EndUser.updateOne({
            _id: id,
        }, data);
        return true;
    }

    public async updateUserImage(id: string, image: string) {
        const user = await EndUser.findById(id);
        if (!user) return null;

        await EndUser.updateOne(
            { _id: id },
            { $set: { profile_photo: image } }
        );
        return user;
    }
}
