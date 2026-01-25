import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE } from "admin/constants";
import { CONFIG } from "../../config";
import { Role } from "server/database/schema";

interface IActionPermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}
const hasPermission = async (
    role: string,
    permissionRole: string,
    permissionAccess: keyof IActionPermissions
): Promise<boolean> => {
    try {
        const data = await Role.findById(role);

        const rolePermissions = (
            data.role_permissions as unknown as Map<string, IActionPermissions>
        )?.get(permissionRole);

        return rolePermissions[permissionAccess];
    } catch (error) {
        return false;
    }
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req?.headers?.authorization;
    if (!token) {
        return res
            .status(401)
            .send(
                sendResponse(
                    RESPONSE_TYPE.ERROR,
                    ERROR_MESSAGE.UNAUTHORIZED_REQUEST
                )
            );
    }

    try {
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        jwt.verify(
            token,
            CONFIG.ACCESS_TOKEN_SECRET,
            {},
            async (err, decoded: any) => {
                if (err) {
                    return res
                        .status(401)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.ERROR,
                                ERROR_MESSAGE.UNAUTHORIZED_REQUEST
                            )
                        );
                }
                (req as any).user = decoded;
                next();
            }
        );
    } catch (err) {
        return res.status(400).send(ERROR_MESSAGE.INVALID_TOKEN);
    }
};

export const authorize = (
    PermissionRole: string,
    permissionAccess: keyof IActionPermissions
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const { role } = user;
        const hasPermissionResult = await hasPermission(role, PermissionRole, permissionAccess);
                if (!user || !hasPermissionResult) {

            return res
                .status(403)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.FORBIDDEN_REQUEST
                    )
                );
        }
        next();
    };
};
