import { NextFunction, Request, Response } from "express";
import Joi from "@hapi/joi";
import { validateReq } from "../../../helpers/api-validations";

const topicBody = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.base": "Title must be a string",
    }),
    subject: Joi.string().required().messages({
        "any.required": "Subject is required",
        "string.base": "Subject must be a string",
    }),
    active: Joi.boolean().required().messages({
        "any.required": "Active is required",
    }),
});

export const validateTopicBody = async (req: Request, res: Response, next: NextFunction) =>
    validateReq(req, res, next, topicBody, "body");

// const listTopicQuery = Joi.object().keys({
//     size: Joi.number().min(1).required().messages({
//         "any.required": "Size is required",
//         "number.min": "Size must be a positive number",
//     }),
//     skip: Joi.number().min(0).required().messages({
//         "any.required": "Skip is required",
//         "number.min": "Skip must be a positive number or zero",
//     }),
//     search: Joi.string().optional().allow(""),
//     sorting: Joi.string().optional().allow(""),
// });

// export const validateListTopicQuery = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => validateReq(req, res, next, listTopicQuery, "query");

const addTopicAllowedCountArray = Joi.object({
  topics: Joi.array()
    .items(
      Joi.object({
        topic_id: Joi.string().required().messages({
          "any.required": "topic_id is required",
          "string.base": "topic_id must be a string",
        }),
        allowed_questions: Joi.number().required().messages({
          "any.required": "allowed_questions is required",
          "number.base": "allowed_questions must be a number",
        }),
      })
    )
    .required()
    .messages({
      "any.required": "topics is required",
      "array.base": "topics must be an array",
    }),
    course_id:Joi.string().required(),
    total_time:Joi.number().required()
});

  

export const validateAddTopicAllowedCountBody = async (req: Request, res: Response, next: NextFunction) =>
validateReq(req, res, next, addTopicAllowedCountArray, "body");


