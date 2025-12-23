import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

// Schema to validate the coupon body (for add and edit operations)
const couponBody = Joi.object({
    code: Joi.string().required().messages({
        "any.required": "Coupon code is required",
    }),
    discount_percentage: Joi.number().min(0).max(100).required().messages({
        "any.required": "Discount percentage is required",
        "number.min": "Discount percentage must be a positive number",
        "number.max": "Discount percentage cannot exceed 100",
    }),
    valid_from: Joi.date().required().messages({
        "any.required": "Start date is required",
        "date.base": "Valid from date must be a valid date",
    }),
    valid_until: Joi.date().required().greater(Joi.ref('valid_from')).messages({
        "any.required": "End date is required",
        "date.base": "Valid until date must be a valid date",
        "date.greater": "Valid until date must be greater than valid from date",
    }),
    active: Joi.boolean().required().messages({
        "any.required": "Active status is required",
    }),
});

// Validation function for the coupon body
export const validateCouponBody = async (req: Request, res: Response, next: NextFunction) =>
    validateReq(req, res, next, couponBody, "body");

// Schema for validating query parameters when listing coupons
const listCouponQuery = Joi.object().keys({
    size: Joi.number().min(1).required().messages({
        "any.required": "Size is required",
        "number.min": "Size must be a positive number",
    }),
    skip: Joi.number().min(0).required().messages({
        "any.required": "Skip is required",
        "number.min": "Skip must be a positive number or zero",
    }),
    search: Joi.string().optional().allow(""),
    sorting: Joi.string().optional().allow(""),
});

// Validation function for the list query parameters
export const validateListCouponQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listCouponQuery, "query");

// Schema for validating the list of coupon IDs to be deleted
const deleteCouponBody = Joi.object().keys({
    ids: Joi.array().min(1).items(Joi.string().required()).required().messages({
        "any.required": "IDs are required",
        "array.min": "At least one coupon ID is required",
        "string.base": "Each ID must be a string",
    }),
});

// Validation function for deleting coupons
export const validateDeleteCouponBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, deleteCouponBody, "body");

// Schema for validating the coupon ID parameter in the URL
const couponIdParams = Joi.object().keys({
    id: Joi.string().required().messages({
        "any.required": "Coupon ID is required",
        "string.base": "Coupon ID must be a valid string",
    }),
});

// Validation function for the coupon ID parameter
export const validateCouponIdParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, couponIdParams, "params");
