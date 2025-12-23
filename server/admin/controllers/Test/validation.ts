import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const topicBody = Joi.object({
    user_id: Joi.string().required().messages({
        "any.required": "user_id is required",
        "string.base": "user_id must be a string",
    }),
    type: Joi.string().required().messages({
        "any.required": "type is required",
        "string.base": "type must be a string",
    }),
    duration_of_exam: Joi.number().required().messages({
        "any.required": "duration_of_exam is required",
        "number.base": "duration_of_exam must be a number",
    }),
    total_questions: Joi.number().messages({
        "any.required": "total_questions is required",
        "number.base": "total_questions must be a number",
    }),
    topics: Joi.array().optional().messages({
        "any.required": "topics is required",
    }),
    tutor: Joi.boolean().optional().messages({
        "any.required": "tutor is required",
    }),
    question_mode: Joi.array().optional().messages({
        "any.required": "question_mode is required",
    }),
    course_id: Joi.string().optional().allow("").messages({
        "any.required": "course_id is required",
    }),
});

export const validateCreateTestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, topicBody, "body");

const listAllUserTest = Joi.object().keys({
    type: Joi.string().required(),
    user_id: Joi.string().required(),
    course_id: Joi.string().optional().allow(""),
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

export const validateFetchUserTestParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, listAllUserTest, "query");

const getActiveUserTest = Joi.object().keys({
    _id: Joi.string().required(),
    user_id: Joi.string().required(),
    test_type: Joi.string().required(),
});

export const validateActiveTestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, getActiveUserTest, "query");

const submitQuestionBody = Joi.object({
    question_id: Joi.string().required().messages({
        "any.required": "question_id is required",
        "string.base": "question_id must be a string",
    }),
    test_id: Joi.string().required().messages({
        "any.required": "test_id is required",
        "string.base": "test_id must be a string",
    }),
    selected_option_id: Joi.string().allow(null).required().messages({
        "any.required": "selected_option_id is required",
        "number.base": "selected_option_id must be a number",
    }),
});

export const validateSubmitQuestionTestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, submitQuestionBody, "body");

const handleQuestionActionBody = Joi.object({
    current_question_id: Joi.string().required().messages({
        "any.required": "current_question_id is required",
        "string.base": "current_question_id must be a string",
    }),
    new_question_id: Joi.string().allow(null).messages({
        "any.required": "new_question_id is required",
        "string.base": "new_question_id must be a string",
    }),
    upcoming_question_id: Joi.string().allow(null).messages({
        "any.required": "upcoming_question_id is required",
        "string.base": "upcoming_question_id must be a string",
    }),
    test_id: Joi.string().required().messages({
        "any.required": "test_id is required",
        "string.base": "test_id must be a string",
    }),
    action: Joi.string().required().messages({
        "any.required": "selected_option_id is required",
        "number.base": "selected_option_id must be a number",
    }),
});

export const validatehandleQuestionActionBodyBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, handleQuestionActionBody, "body");

const submitUserTest = Joi.object().keys({
    test_id: Joi.string().required(),
});

export const ValidateSubmitUserTestBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, submitUserTest, "body");

const userTestReport = Joi.object().keys({
    id: Joi.string().required(),
});

export const seeUserTestReportBody = async (
    req: Request,
    res: Response,
    next: NextFunction
) => validateReq(req, res, next, userTestReport, "params");
