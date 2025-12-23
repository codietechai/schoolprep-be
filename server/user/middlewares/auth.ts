import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { sendResponse } from "admin/helpers";
import { ERROR_MESSAGE, RESPONSE_TYPE } from "admin/constants";
import { CONFIG } from "../../config";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req?.headers?.authorization;
    if (!token)
        return res
            .status(401)
            .send(
                sendResponse(
                    RESPONSE_TYPE.ERROR,
                    ERROR_MESSAGE.UNAUTHORIZED_REQUEST
                )
            );

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
                (req as any).user_id = decoded.id;
                next();
            }
        );
    } catch (err) {
        return res.status(400).send(ERROR_MESSAGE.INVALID_TOKEN);
    }
};
