import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";
import { validateReq } from "../../../helpers/api-validations";

const questionBodySchema = Joi.object({
    question_text: Joi.string().required(),
    subject_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    topic_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    course_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    options: Joi.array()
        .items(
            Joi.object({
                text: Joi.string().required(),
                isCorrect: Joi.boolean().required(),
            })
        )
        .min(1)
        .required(),
    explanation_text: Joi.string().allow(null).optional(),
    explanation_video: Joi.string().allow(null).optional(),
    explanation_image: Joi.string().optional().allow(""),
    explanation_image_data: Joi.string().optional().allow(""),
    image_url: Joi.string().optional().allow(""),
    image_url_data: Joi.string().optional().allow(""),
    difficulty_level: Joi.string().valid("EASY", "MEDIUM", "HARD").required(),
    is_diagnostic: Joi.boolean().required(),
    is_preparatory: Joi.boolean().required(),
    is_real_exam: Joi.boolean().required(),
});

export const validateQuestionBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, questionBodySchema, "body");

const listQuestionQuerySchema = Joi.object().keys({
    size: Joi.number().min(1).required(),
    skip: Joi.number().min(0).required(),
    search: Joi.string().optional().allow(""),
    sorting: Joi.string().optional().allow(""),
});

export const validateListQuestionQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listQuestionQuerySchema, "query");

const questionIdParamsSchema = Joi.object().keys({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});

export const validateQuestionIdParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, questionIdParamsSchema, "params");

const deleteQuestionBodySchema = Joi.object().keys({
    ids: Joi.array()
        .min(1)
        .items(
            Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
        )
        .required(),
});

export const validateDeleteQuestionBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, deleteQuestionBodySchema, "body");
