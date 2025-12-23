import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

// Schema to validate the course category body for add and edit operations
const categoryBody = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  active: Joi.boolean().required(),
  image: Joi.string().optional().allow(''),
  image_data: Joi.string().optional().allow(''),
});

// Validation function for the course category body (for add and edit operations)
export const validateCategoryBody = async (req: Request, res: Response, next: NextFunction) =>
  validateReq(req, res, next, categoryBody, "body");

const listQuery = Joi.object().keys({
  size: Joi.number().required(),
  skip: Joi.number().required(),
  search: Joi.string().optional().allow(""),
  sorting: Joi.string().optional().allow(""),
});

export const validateListQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, listQuery, "query");

// Schema to validate the delete category body (for deleting categories)
const deleteCategoryBody = Joi.object().keys({
  ids: Joi.array().min(1).items(Joi.string().required()).required().messages({
    "any.required": "IDs are required",
    "array.min": "At least one category ID is required",
    "string.base": "Each ID must be a string",
  }),
});

// Validation function for deleting categories
export const validateDeleteCategoryBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, deleteCategoryBody, "body");

// Schema for validating the category ID parameter in the URL
const categoryIdParams = Joi.object().keys({
  id: Joi.string().required().messages({
    "any.required": "Category ID is required",
    "string.base": "Category ID must be a valid string",
  }),
});

// Validation function for the category ID parameter
export const validateCategoryIdParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, categoryIdParams, "params");
