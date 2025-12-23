import e, { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const loginUserBody = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validateLoginUserBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, loginUserBody, "body");

const signupUserBody = Joi.object().keys({
    selectedChart: Joi.number().required(),
    selectedAlgorithm: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isAgreed: Joi.number().required(),
    captcha: Joi.string().required(),
});

export const validateSignupUserBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, signupUserBody, "body");

const changePasswordBody = Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
});

export const validateChangePasswordBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, changePasswordBody, "body");
