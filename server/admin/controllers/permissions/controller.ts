import { Request, Response, NextFunction } from "express";
import PermissionService from "./service";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE, SUCCESS_MESSAGE } from "admin/constants";

export default class PermissionController {
    static async addPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, active, updatedBy } = req.body;

            const existingPermission = await PermissionService.getByName(name);
            if (existingPermission) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.PERMISSION_EXISTS)
                );
            }

            const newPermission = await PermissionService.addPermission({
                name,
                description,
                active,
            });

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.PERMISSION_ADDED, newPermission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const permissions = await PermissionService.getAllPermissions();
            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.PERMISSIONS_FETCHED, permissions)
            );
        } catch (err) {
            next(err);
        }
    }

    static async getPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const permission = await PermissionService.getPermissionById(id);

            if (!permission) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.PERMISSION_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.PERMISSION_FETCHED, permission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async editPermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, active, updatedBy } = req.body;

            const existingPermission = await PermissionService.getPermissionById(id);
            if (!existingPermission) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.PERMISSION_NOT_FOUND)
                );
            }

            const updatedPermission = await PermissionService.updatePermission(id, {
                name,
                description,
                active,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.PERMISSION_UPDATED, updatedPermission)
            );
        } catch (err) {
            next(err);
        }
    }

    static async deletePermission(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids } = req.body;

            if (!ids || !ids.length) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await PermissionService.deletePermissions(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.PERMISSION_DELETED)
            );
        } catch (err) {
            next(err);
        }
    }
}
