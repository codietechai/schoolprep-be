import e, { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const createCheckoutSessionBody = Joi.object().keys({
    priceId: Joi.string().required(),
    userId:Joi.string().required(),
    courseId:Joi.string().required(),
    productId:Joi.string().required(),
});

export const validateCreateCheckoutSessionBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, createCheckoutSessionBody, "body");
