import { User, ImageCrud } from "admin/models";
import { TUser } from "common/types/user/user.type";

export default class UserService {
    static async getUsers(data: any) {
        const obj = new User();
        const response = await obj.getUsers(data);
        return response;
    }

    static async addUser(data: TUser, image?: Buffer) {
        const obj = new User();
        let resp = await obj.addUser(data);
        if (image && resp._id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `images/users/${resp._id}-${dateId}`;
            const imgRes = await img.uploadImage(image, fileName);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(resp._id, imageUrl);
        }
        return resp;
    }

    static async editUser(id: string, data: TUser, image?: Buffer) {
        const obj = new User();
        await obj.editUser(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.profile_photo) {
                const oldPath = data.profile_photo.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/users/${id}-${dateId}`;

                imgRes = (await img.updateImage(
                    `images/users/${oldFileName}`,
                    image,
                    newFileName
                )) as string;
            } else {
                imgRes = await img.uploadImage(image, `images/users/${id}`);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateUserImage(id, imageUrl);
        }
        return { ...data };
    }

    static async getUserById(id: number) {
        const obj = new User();
        const response = await obj.getUserById(id);
        return response;
    }

    static async getUsersById(id: number[]) {
        const obj = new User();
        const response = await obj.getUsersById(id);
        return response;
    }

    static async deleteUser(ids: number[]) {
        const obj = new User();
        const response = await obj.deleteUser(ids);
        return response;
    }

    static async deleteUserImage(data: TUser) {
        const img = new ImageCrud();
        const oldPath = data?.profile_photo?.split("/");
        const oldFileName = oldPath?.[oldPath?.length - 1];
        oldPath &&
            oldFileName &&
            (await img.deleteImage(`images/users/${oldFileName}`));
        return true;
    }

    static async signup(data: TUser) {
        const obj = new User();
        let resp = await obj.addUser(data);
        return resp;
    }
}
