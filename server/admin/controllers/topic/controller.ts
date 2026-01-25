import { Request, Response, NextFunction } from "express";
import { get, isEmpty } from "lodash";
import TopicService from "./service";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { Course, Question, Topic } from "server/database/schema";

export default class TopicController {
    static async addTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const subject = get(req?.body, "subject", "");
            const title = get(req?.body, "title", "");
            const active = get(req?.body, "active", true);

            const newTopic = await TopicService.addTopic({
                subject,
                title,
                active,
            });

            return res
                .status(201)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPIC_CREATED,
                        newTopic
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTopics(req: Request, res: Response, next: NextFunction) {
        try {
            const subject = get(req?.params, "subject", 10);

            const topics = await TopicService.getTopics(subject);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPICS_FETCHED,
                        topics
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const subject = get(req?.params, "subject", "");

            const topic = await TopicService.getTopicById(id);
            if (isEmpty(topic)) {
                return res
                    .status(404)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.TOPIC_NOT_FOUND
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPIC_FETCHED,
                        topic
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const subject = get(req?.body, "subject", "");
            const title = get(req?.body, "title", "");
            const active = get(req?.body, "active", true);

            const topic = await TopicService.getTopicById(id);
            if (isEmpty(topic)) {
                return res
                    .status(404)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.TOPIC_NOT_FOUND
                        )
                    );
            }

            const updatedTopic = await TopicService.updateTopic(id, {
                subject,
                title,
                active,
            });

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPIC_UPDATED,
                        updatedTopic
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async deleteTopic(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", []);

            if (isEmpty(id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.NO_TOPICS_TO_DELETE
                        )
                    );
            }

            await TopicService.deleteTopics(id);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPICS_DELETED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getCourseTopics(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const course = get(req?.params, "course", 10);

            const topics = await TopicService.getCourseTopics(course);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TOPICS_FETCHED,
                        topics
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async addTopicAllowedQuestionsCount(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const topics = get(req?.body, "topics", []);
            const course_id = get(req?.body, "course_id", '');
            const total_time = get(req?.body, "total_time", '');

            if (!Array.isArray(topics) || topics.length === 0) {
                return res.status(400).send({
                    message: "Invalid or empty topics array provided.",
                });
            }

            const results = [];
            const errors = [];

            await Course.findOneAndUpdate({
                _id:course_id
            },{
                diagnostic_test_time:total_time  
            })

            for (const topic of topics) {
                const topic_id = get(topic, "topic_id", "");
                const count = get(topic, "allowed_questions", 0);

                const allowed_questions = Number(count);

                if (!topic_id || isNaN(allowed_questions)) {
                    errors.push({
                        topic_id,
                        message: "Invalid topic_id or allowed_questions value.",
                    });
                    continue;
                }

                const alreadyExist = await Topic.findOne({ topic_id });
                if (alreadyExist) {
                    errors.push({
                        topic_id,
                        message:
                            "Questions count already added for this topic.",
                    });
                    continue;
                }

                const totalTopicQuestions = await Question.find({ topic_id });

                if (totalTopicQuestions.length >= allowed_questions) {
                    const topicAllowedQuestionsAdded =
                        await TopicService.addTopicAllowedQuestionsCount({
                            topic_id,
                            allowed_questions,
                        });

                    if (topicAllowedQuestionsAdded) {
                        await Course.findOneAndUpdate(
                            { _id: course_id },
                            {
                                $addToSet: {
                                    selected_topic_for_exam:
                                        topicAllowedQuestionsAdded._id,
                                },
                            }
                        );
                    }
                    results.push({
                        topic_id,
                        message:
                            "Topic allowed questions count added successfully.",
                        data: topicAllowedQuestionsAdded,
                    });
                } else {
                    errors.push({
                        topic_id,
                        message:
                            "Allowed questions count exceeds total questions available for the topic.",
                    });
                }
            }

            return res.status(200).send({
                message: "Processing completed.",
                successes: results,
                errors,
            });
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
