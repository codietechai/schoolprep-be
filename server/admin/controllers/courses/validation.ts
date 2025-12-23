import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

// Schema to validate the course body for adding and editing courses
const courseBody = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  image: Joi.string().optional().allow(''),
  image_data: Joi.string().optional().allow(''),
  category: Joi.any().required(),
  active: Joi.boolean().required(),
  level: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED').required(),
  subjects: Joi.array().items(Joi.string().length(24).hex()).required()
});

// Validation function for the course body (for adding and editing courses)
export const validateCourseBody = async (req: Request, res: Response, next: NextFunction) =>
  validateReq(req, res, next, courseBody, "body");

// Schema to validate the query parameters for the list operation
const listCourseQuery = Joi.object().keys({
  size: Joi.number().min(1).required(),
  skip: Joi.number().min(0).required(),
  search: Joi.string().optional().allow(""),
  sorting: Joi.string().optional().allow(""),
});

// Validation function for the list query parameters
export const validateListCourseQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, listCourseQuery, "query");

// Schema for validating the course ID parameter in the URL
const courseIdParams = Joi.object().keys({
  id: Joi.string().required(),
});

// Validation function for the course ID parameter
export const validateCourseIdParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, courseIdParams, "params");

// Schema to validate the delete course body (for deleting courses)
const deleteCourseBody = Joi.object().keys({
  ids: Joi.array().min(1).items(Joi.string().required()).required(),
});

// Validation function for deleting courses
export const validateDeleteCourseBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, deleteCourseBody, "body");
