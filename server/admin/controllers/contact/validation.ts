import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const listQuery = Joi.object().keys({
    size: Joi.number().min(1).required(),
    skip: Joi.number().min(0).required(),
    search: Joi.string().optional().allow(""),
    sorting: Joi.string().optional().allow(""),
});

export const validateListQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listQuery, "query");
