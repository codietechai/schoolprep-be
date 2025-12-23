import { Request, Response, NextFunction } from "express";
import ContactService from "./service";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class ContactController {
    static async getContacts(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ContactService.getAllContacts();
            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CONTACTS_FETCHED, data)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getContact(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await ContactService.getContactById(id);

            if (!data) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.CONTACT_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CONTACT_FETCHED, data)
            );
        } catch (err) {
            next(err);
        }
    }

    static async deleteContact(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await ContactService.deleteContacts(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CONTACT_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}
