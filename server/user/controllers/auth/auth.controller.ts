import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import * as bcrypt from "bcrypt";
import AuthService from "./auth.service";
import {
    sendResponse,
    createAccessToken,
    createRefreshToken,
    createPassword,
} from "admin/helpers";
import { RESPONSE_TYPE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "admin/constants";
import { createUserResponse } from "helpers/format-response";
import { ImageCrud } from "admin/models";

export default class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const email = get(req?.body, "email", "");
            const password = get(req?.body, "password", "");
            const ip = req.socket.localAddress;
            const user = await AuthService.getUserByEmail(email);

            if (isEmpty(user)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_LOGIN_REQUEST
                        )
                    );
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_LOGIN_REQUEST
                        )
                    );
            }

            const accessToken = createAccessToken({
                id: user.id,
                email: user.email,
                role:user.role._id,
            });

            const refreshToken = createRefreshToken({
                email: user.email,
            });

            await AuthService.updateRefreshToken({
                id: user.id,
                refresh_token: refreshToken,
                last_login_at: new Date(),
                last_login_ip: ip,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.LOGGED_IN, {
                    user: createUserResponse(user),
                    accessToken,
                    refreshToken,
                })
            );
        } catch (err) {
            console.log("login",err)
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const ip = req.socket.localAddress;
            const email = get(req?.body, "email", "");
            const password = get(req?.body, "password", "");

            const existingUser = await AuthService.getUserByEmail(email);
            if (!isEmpty(existingUser)) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.USER_ALREADY_EXISTS,
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await AuthService.createUser({
                email,
                password: hashedPassword,
                last_login_ip: ip,
                last_login_at: new Date(),
                status: 'active'
            } as any);

            const accessToken = createAccessToken({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            });


            const refreshToken = createRefreshToken({
                email: newUser.email,
            });

            await AuthService.updateRefreshToken({
                id: newUser.id,
                refresh_token: refreshToken,
                last_login_at: new Date(),
                last_login_ip: ip,
            });

            const user = await AuthService.getUserByEmail(newUser?.email);

            return res.status(201).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.SIGNUP_SUCCESS,
                    {
                        user: createUserResponse(user),
                        accessToken,
                        refreshToken,
                    }
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req, "user_id", 0);
            const email = get(req?.body, "email", "");
            const full_name = get(req?.body, "full_name", "");
            const contact_number = get(req?.body, "contact_number", "");
            const phone_code = get(req?.body, "phone_code", 0);

            const user = await AuthService.editProfile({
                id,
                email,
                full_name,
                contact_number,
                phone_code,
            });

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PROFILE_UPDATED,
                    {
                        user: createUserResponse(user),
                    }
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async changePassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const id = get(req, "user_id", 0);
            const old_password = get(req?.body, "old_password", "");
            const new_password = get(req?.body, "new_password", "");

            const user = await AuthService.getUserPassword(id);
            const validPassword = await bcrypt.compare(
                old_password,
                user.password
            );
            if (!validPassword) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_OLD_PASSWORD
                        )
                    );
            }

            const hashedPassword = await createPassword(new_password);
            await AuthService.changePassword({
                id,
                password: hashedPassword,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.PASSWORD_UPDATED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = get(req, "user_id", 0);
            const type = get(req?.body, "type", "");
            const profile = get(req?.body, "profile", {});

            let payload: any = { ...profile };

            if (profile?.profile_photo) {
                const parts = profile?.profile_photo?.split(";base64,");
                const base64Image = parts?.pop();
                const imageBuffer = Buffer.from(base64Image!, "base64");
                const img = new ImageCrud();
                const dateId = new Date().getTime();
                const fileName = `images/user/${user_id}-${dateId}`;
                const imageUrl = await img.uploadImage(imageBuffer, fileName);
                payload["profile_photo"] = imageUrl;
            }

            const user = await AuthService.getUserById(user_id);
            if (isEmpty(user)) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.USER_NOT_EXISTS,
                });
            }

            await AuthService.updateUser(payload, user_id);

            return res
                .status(201)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.USER_DETAILS_UPDATED,
                        payload
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
