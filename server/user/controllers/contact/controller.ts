import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import ContactService from "./service";
import {
    sendResponse,
} from "admin/helpers";
import { RESPONSE_TYPE, ERROR_MESSAGE, SUCCESS_MESSAGE } from "admin/constants";
import { validateCaptcha } from "../../../helpers";

export default class ContactController {
    static async addContact(req: Request, res: Response, next: NextFunction) {
        try {
            const name = get(req?.body, "name", "");
            const email = get(req?.body, "email", "");
            const phone = get(req?.body, "phone", "");
            const description = get(req?.body, "description", "");
            const captcha = get(req?.body, "captcha", "");

            const isCaptchaValid = await validateCaptcha(captcha);

            if (!isCaptchaValid) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.INVALID_CAPTCHA
                        )
                    );
            }

            await ContactService.addContact({
                name,
                email,
                phone,
                description
            } as any);

            return res.status(201).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.CONTACT_SUCCESS,

                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
