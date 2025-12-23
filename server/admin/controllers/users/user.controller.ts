import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import { sendResponse, createPassword } from "admin/helpers";
import AuthService from "../auth/auth.service";
import UserService from "./user.service";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class UserController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const trashOnly = get(req?.query, "trashOnly", "");
            let sorting = get(req?.query, "sorting", "id DESC");
            sorting = sorting.split(" ");

            const users = await UserService.getUsers({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting,
                trashOnly,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USERS_FETCHED,
                        users
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async addUser(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const image: string = value?.profile_photo_data;
            delete value?.profile_photo_data;

            const existingUser = await AuthService.getUserByEmail(value.email);

            if (!isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_EXISTS
                        )
                    );
            }

            const hashedPassword = await createPassword(value.password);

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            // use imageBuffer
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }
            await UserService.addUser(
                {
                    ...value,
                    password: hashedPassword,
                },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_CREATED
                    )
                );
        } catch (err) {
            console.log(err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            let value = req.body;
            const { id } = req.params;
            const image = value.profile_photo_data;
            delete value.profile_photo_data;

            // const hashedPassword = await createPassword(value.password);
            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }
            await UserService.editUser(
                id,
                { ...value },
                imageBuffer
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_UPDATED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req?.body, "ids", "");
            const existingUser = await UserService.getUsersById(ids);

            if (isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_NOT_EXISTS
                        )
                    );
            }

            await UserService.deleteUser(ids);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_DELETED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const existingUser = await UserService.getUserById(id as number);

            if (isEmpty(existingUser)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.USER_NOT_EXISTS
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_FETCHED,
                        existingUser
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
