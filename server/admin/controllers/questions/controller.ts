import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import QuestionService from "./service";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { TAddQuestion, TEditQuestion } from "./types";

export default class QuestionController {
    static async addQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const question_text = get(req.body, "question_text", "");
            const options = get(req.body, "options", []);
            const subject_id = get(req.body, "subject_id", "");
            const topic_id = get(req.body, "topic_id", "");
            const course_id = get(req.body, "course_id", "");
            const explanation_text = get(req.body, "explanation_text", "");
            const explanation_image = get(req.body, "explanation_image", "");
            const explanation_video = get(req.body, "explanation_video", "");
            const difficulty_level = get(req.body, "difficulty_level", "");
            const is_diagnostic = get(req.body, "is_diagnostic", "");
            const is_preparatory = get(req.body, "is_preparatory", "");
            const is_real_exam = get(req.body, "is_real_exam", "");
            const image: string = req.body?.explanation_image_data;
            delete req.body?.explanation_image_data;
            const image_url_data: string = req.body?.image_url_data;
            delete req.body?.image_url_data;

            const existingQuestion = await QuestionService.getQuestionByText(
                question_text
            );
            if (existingQuestion) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.QUESTION_EXISTS,
                });
            }

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            let imageUrlBuffer: Buffer | undefined;
            if (image_url_data) {
                const parts = image_url_data?.split(";base64,");
                const base64Image = parts?.pop();
                imageUrlBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image_url_data && !imageUrlBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const questionData: TAddQuestion = {
                question_text,
                options,
                subject_id,
                course_id,
                topic_id,
                explanation_text,
                explanation_image,
                explanation_video,
                difficulty_level,
                is_diagnostic,
                is_preparatory,
                is_real_exam,
            };

            const addedQuestion = await QuestionService.addQuestion(
                questionData,
                imageUrlBuffer,
                imageBuffer
            );

            return res
                .status(201)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTION_ADDED,
                        { id: addedQuestion.id }
                    )
                );
        } catch (err) {
            console.error("Error while adding question:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getQuestions(req: Request, res: Response, next: NextFunction) {
        try {
            const size = parseInt(get(req.query, "size", "10"), 10);
            const skip = parseInt(get(req.query, "skip", "0"), 10);
            const search = get(req.query, "search", "");
            const sorting = get(req.query, "sorting", "id DESC").split(" ");

            const questions = await QuestionService.getQuestions({
                offset: skip,
                limit: size,
                search,
                sorting,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTIONS_FETCHED,
                        questions
                    )
                );
        } catch (err) {
            console.error("Error while fetching questions:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req.params, "id", "");
            const question = await QuestionService.getQuestionById(id);

            if (isEmpty(question)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.QUESTION_NOT_FOUND
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTION_FETCHED,
                        question
                    )
                );
        } catch (err) {
            console.error("Error while fetching question:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req.params, "id", "");
            const question_text = get(req.body, "question_text", "");
            const options = get(req.body, "options", []);
            const subject_id = get(req.body, "subject_id", "");
            const topic_id = get(req.body, "topic_id", "");
            const course_id = get(req.body, "course_id", "");
            const explanation_text = get(req.body, "explanation_text", "");
            const explanation_image = get(req.body, "explanation_image", "");
            const explanation_video = get(req.body, "explanation_video", "");
            const difficulty_level = get(req.body, "difficulty_level", "");
            const is_diagnostic = get(req.body, "is_diagnostic", "");
            const is_preparatory = get(req.body, "is_preparatory", "");
            const is_real_exam = get(req.body, "is_real_exam", "");
            const image = req.body.explanation_image_data;
            delete req.body.explanation_image_data;
            const image_url_data = req.body.image_url_data;
            delete req.body.image_url_data;

            const updatedQuestionData: TEditQuestion = {
                question_text,
                options,
                subject_id,
                topic_id,
                course_id,
                explanation_text,
                explanation_image,
                explanation_video,
                difficulty_level,
                is_diagnostic,
                is_preparatory,
                is_real_exam,
            };

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            let imageUrlBuffer: Buffer | undefined;
            if (image_url_data) {
                const parts = image_url_data?.split(";base64,");
                const base64Image = parts?.pop();
                imageUrlBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image_url_data && !imageUrlBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const updatedQuestion = await QuestionService.updateQuestion(
                id,
                updatedQuestionData,
                imageUrlBuffer,
                imageBuffer
            );

            if (!updatedQuestion) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.QUESTION_NOT_FOUND
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTION_UPDATED
                    )
                );
        } catch (err) {
            console.error("Error while updating question:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async deleteQuestion(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const ids = get(req.body, "ids", []);

            if (isEmpty(ids)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.NO_IDS_PROVIDED
                        )
                    );
            }

            const deletedCount = await QuestionService.deleteQuestions(ids);

            if (deletedCount === 0) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.QUESTION_NOT_FOUND
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTIONS_DELETED
                    )
                );
        } catch (err) {
            console.error("Error while deleting questions:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getCourseQuestions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const size = parseInt(get(req.query, "size", "10"), 10);
            const skip = parseInt(get(req.query, "skip", "0"), 10);
            const search = get(req.query, "search", "");
            const sorting = get(req.query, "sorting", "id DESC").split(" ");
            const courseId = get(req.query, "course_id", "");

            if (!courseId) {
                return res.status(400).send({
                    message: "course_id is required",
                });
            }

            const questions = await QuestionService.getCourseQuestions(
                courseId,
                {
                    offset: skip,
                    limit: size,
                    search,
                    sorting,
                }
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.QUESTIONS_FETCHED,
                        questions
                    )
                );
        } catch (err) {
            console.error("Error while fetching course questions:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
