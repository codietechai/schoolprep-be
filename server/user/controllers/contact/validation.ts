import e, { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const contactBody = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(""),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    captcha: Joi.string().required(),
});

export const validateContactBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, contactBody, "body");
