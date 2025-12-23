import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

// Schema to validate the subject body for add and edit operations
const subjectBody = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Subject name is required",
        "string.base": "Subject name must be a string",
    }),
    description: Joi.string().optional().allow('').messages({
        "string.base": "Description must be a string",
    }),
    active: Joi.boolean().required().messages({
        "any.required": "Active status is required",
    }),
});

// Validation function for the subject body (for add and edit operations)
export const validateSubjectBody = async (req: Request, res: Response, next: NextFunction) =>
    validateReq(req, res, next, subjectBody, "body");

// Schema to validate the query parameters for the list operation
const listSubjectQuery = Joi.object().keys({
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
export const validateListSubjectQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listSubjectQuery, "query");

// Schema to validate the delete subject body (for deleting subjects)
const deleteSubjectBody = Joi.object().keys({
    ids: Joi.array().min(1).items(Joi.string().required()).required().messages({
        "any.required": "IDs are required",
        "array.min": "At least one subject ID is required",
        "string.base": "Each ID must be a string",
    }),
});

// Validation function for deleting subjects
export const validateDeleteSubjectBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, deleteSubjectBody, "body");

// Schema for validating the subject ID parameter in the URL
const subjectIdParams = Joi.object().keys({
    id: Joi.string().required().messages({
        "any.required": "Subject ID is required",
        "string.base": "Subject ID must be a valid string",
    }),
});

// Validation function for the subject ID parameter
export const validateSubjectIdParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, subjectIdParams, "params");
