import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const planBody = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  price: Joi.number().required(),
  duration: Joi.number().required(),
  active: Joi.boolean().required(),
  course: Joi.string().required()
});

export const validatePlanBody = async (req: Request, res: Response, next: NextFunction) =>
  validateReq(req, res, next, planBody, "body");

const listPlanQuery = Joi.object().keys({
  size: Joi.number().min(1).required(),
  skip: Joi.number().min(0).required(),
  search: Joi.string().optional().allow(""),
  sorting: Joi.string().optional().allow(""),
});

export const validateListPlanQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, listPlanQuery, "query");

const planIdParams = Joi.object().keys({
  id: Joi.string().required(),
});

export const validatePlanIdParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, planIdParams, "params");

const deletePlanBody = Joi.object().keys({
  ids: Joi.array().min(1).items(Joi.string().required()).required(),
});

export const validateDeletePlanBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => validateReq(req, res, next, deletePlanBody, "body");
