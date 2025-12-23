import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const loginAdminBody = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validateLoginAdminBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, loginAdminBody, "body");

const twoFaAdminBody = Joi.object().keys({
    user_id: Joi.string().required(),
    code: Joi.string().required(),
});

export const validateTwoFaAdminBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, twoFaAdminBody, "body");

const updateProfileBody = Joi.object().keys({
    full_name: Joi.string().required(),
    contact_number: Joi.string().required(),
    phone_code: Joi.string().required(),
    profile_photo: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
});

export const validateUpdateProfileBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, updateProfileBody, "body");

const changePasswordBody = Joi.object().keys({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
});

export const validateChangePasswordBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, changePasswordBody, "body");

const forgotPasswordBody = Joi.object().keys({
    email: Joi.string().email().required(),
});

export const validateForgotPasswordBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, forgotPasswordBody, "body");

const resetPasswordBody = Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateResetPasswordBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, resetPasswordBody, "body");

const signupAdminBody = Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    is_agreed: Joi.boolean().required(),
});

export const validateSignupAdminBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, signupAdminBody, "body");
