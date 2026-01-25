import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import TestService from "./service";
import mongoose from "mongoose";
import { Course, Topic, User } from "server/database/schema";
import { Test } from "server/database/schema/Test";

export default class TestController {
    static async getOngoingTestId(req: Request, res: Response) {
        try {
            const user_id = get(req?.query, "user_id", "");
            if (!user_id) {
                return res.status(401);
            }
            const ongoingTest = await TestService.getOngoingTestId(user_id);
            if (ongoingTest?.ongoing_test_id) {
                const test = await Test.findOne({
                    _id: ongoingTest?.ongoing_test_id,
                    type: "DIAGNOSTIC",
                    status: "ACTIVE",
                });
                if (test._id) {
                    return res
                        .status(200)
                        .send({
                            message: "Ongoing Test",
                            data: { test_id: test._id },
                        });
                }
            }
            return res.status(200).send({
                message: "No ongoing test",
            });
        } catch (error) {
            console.log("Error getting UserId subject: ", error);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
    static async createTest(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = get(req?.body, "user_id", "");
            const type = get(req?.body, "type", "DIAGNOSTIC");
            const course_id = get(req?.body, "course_id", "");
            const duration_of_exam = get(req?.body, "duration_of_exam", "");
            const topics = get(req?.body, "topics", []);
            const tutor = get(req?.body, "tutor", false);
            const question_mode = get(req?.body, "question_mode", [
                "UNUSED",
                "CORRECT",
                "INCORRECT",
                "SKIPPED",
            ]);
            const total_questions = get(req?.body, "total_questions", 30);
            let chooseQuestions = [];

            if (type === "DIAGNOSTIC") {
                const findAllTopics = await Course.findById(course_id);
                const topicsWithQuestions = await Topic.find({
                    _id: { $in: findAllTopics.selected_topic_for_exam },
                })
                    .populate("questions")
                    .lean();

                topicsWithQuestions.forEach((topic) => {
                    const questionIds = topic.questions.map(
                        (question) => question._id
                    );
                    chooseQuestions.push(...questionIds);
                });

                if (chooseQuestions.flat().length < total_questions) {
                    return res.status(400).send({
                        status: 400,
                        message:
                            "The number of questions selected exceeds the available questions in the current topics ",
                    });
                }

                function getRandomIds(array, count) {
                    const shuffled = array.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count);
                }

                const randomQuestionIds = getRandomIds(
                    chooseQuestions,
                    total_questions
                );

                if (findAllTopics) {
                    const createdTest = await TestService.createTest({
                        user_id,
                        type,
                        duration_of_exam,
                        tutor,
                        question_mode,
                        questions: randomQuestionIds,
                        topics: findAllTopics.selected_topic_for_exam.map(
                            (topic) => ({
                                topic_id: topic,
                            })
                        ),
                        total_questions,
                        status: "ACTIVE",
                        course_id,
                    });
                    if (user_id) {
                        await User.findOneAndUpdate(
                            { _id: user_id },
                            { ongoing_test_id: createdTest._id }
                        );
                    }
                    return res
                        .status(201)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.SUCCESS,
                                SUCCESS_MESSAGE.TEST_STARTED,
                                createdTest
                            )
                        );
                }
            }
            if (type === "PREPARATORY") {
                if (topics.length === 0) {
                    return res.status(400).send({
                        status: 400,
                        message: "topics are required in Preparatory exam",
                    });
                }

                const topicsWithQuestions = await Topic.find({
                    _id: {
                        $in: topics.map(
                            (i) => new mongoose.Types.ObjectId(i.topic_id)
                        ),
                    },
                }).populate("questions");

                let totalTopicQuestionsCount = 0;
                totalTopicQuestionsCount = topics.reduce(
                    (acc, i) => acc + i.allowed_question_number,
                    0
                );

                if (totalTopicQuestionsCount > total_questions) {
                    return res.status(400).send({
                        status: 400,
                        message:
                            "The total number of questions must be greater than or equal to the sum of allowed questions for all topics.",
                    });
                }

                const shuffleArray = (array) => {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                };
                const preAttemptedQuestions = await User.findOne({
                    _id: user_id,
                })
                    .populate("corrected_questions")
                    .populate("wrong_questions")
                    .populate("skipped_questions");

                const correctQuestions =
                    preAttemptedQuestions.corrected_questions.map((q) =>
                        q._id.toString()
                    );
                const incorrectQuestions =
                    preAttemptedQuestions.wrong_questions.map((q) =>
                        q._id.toString()
                    );
                const skippedQuestions =
                    preAttemptedQuestions.skipped_questions.map((q) =>
                        q._id.toString()
                    );

                const totalUserQuestions = [
                    ...correctQuestions,
                    ...incorrectQuestions,
                    ...skippedQuestions,
                ];
                const chooseQuestions = [];

                topicsWithQuestions.forEach((topic) => {
                    const topicData = topics.find(
                        (t) => t.topic_id === topic._id.toString()
                    );
                    if (!topicData) return;

                    let selectedQuestions = [];

                    if (question_mode.includes("CORRECT")) {
                        selectedQuestions = selectedQuestions.concat(
                            topic.questions.filter((q) =>
                                correctQuestions.includes(q._id.toString())
                            )
                        );
                    }

                    if (question_mode.includes("INCORRECT")) {
                        selectedQuestions = selectedQuestions.concat(
                            topic.questions.filter((q) =>
                                incorrectQuestions.includes(q._id.toString())
                            )
                        );
                    }

                    if (question_mode.includes("SKIPPED")) {
                        selectedQuestions = selectedQuestions.concat(
                            topic.questions.filter((q) =>
                                skippedQuestions.includes(q._id.toString())
                            )
                        );
                    }
                    shuffleArray(selectedQuestions);

                    let finalQuestions = selectedQuestions.slice(
                        0,
                        topicData.allowed_questions
                    );

                    if (
                        finalQuestions.length < total_questions &&
                        question_mode.includes("UNUSED")
                    ) {
                        const unusedQuestions = topic.questions.filter((q) => {
                            const isUnused = !totalUserQuestions.includes(
                                q._id.toString()
                            );
                            return isUnused;
                        });

                        shuffleArray(unusedQuestions);
                        const neededMore =
                            topicData.allowed_questions - finalQuestions.length;

                        finalQuestions = [
                            ...finalQuestions,
                            ...unusedQuestions.slice(0, neededMore),
                        ];
                    }
                    chooseQuestions.push(...finalQuestions.map((q) => q._id));
                });

                const getRandomIds = (array, count) => {
                    const shuffled = array.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count);
                };

                const randomQuestionIds = getRandomIds(
                    chooseQuestions,
                    total_questions
                );

                const createdTest = await TestService.createTest({
                    user_id,
                    type,
                    duration_of_exam,
                    tutor,
                    question_mode,
                    questions: randomQuestionIds,
                    topics: topics,
                    total_questions,
                    status: "ACTIVE",
                    course_id,
                });
                return res.status(201).send({
                    success: true,
                    message: "Test started successfully",
                    data: createdTest,
                });
            }
        } catch (err) {
            console.log("Error adding subject: ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getDiagnosticTestCountAndTime(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const course_id = get(req?.params, "id", "");

            const findAllUserTest =
                await TestService.getDiagnosticTestCountAndTime(course_id);

            return res.status(200).send({
                data: findAllUserTest,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    }

    static async getCountToCreatePreprartoryTest(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = get(req?.query, "user_id", "");
            const getAllUserQuestion = await User.find({
                _id: user_id,
            })
                .select("skipped_questions corrected_questions wrong_questions")
                .populate({
                    path: "skipped_questions",
                    select: "topic_id",
                    populate: {
                        path: "topic_id",
                    },
                })
                .populate({
                    path: "wrong_questions",
                    select: "topic_id",
                    populate: {
                        path: "topic_id",
                    },
                })
                .populate({
                    path: "corrected_questions",
                    select: "topic_id",
                    populate: {
                        path: "topic_id",
                    },
                });

            const course_id = get(req?.query, "course_id", "");
            const correctQuestions = [];
            const incorrectQuestions = [];
            const skippedQuestions = [];
            const allTopicQuestions = [];

            {
                const allTopicsQuestions: any = await Course.find({
                    _id: new mongoose.Types.ObjectId(course_id),
                }).populate({
                    path: "selected_topic_for_exam",
                    populate: {
                        path: "questions",
                        select: "topic_id",
                        populate: {
                            path: "topic_id",
                        },
                    },
                });

                allTopicsQuestions.forEach((i) => {
                    i.selected_topic_for_exam.forEach((topic) => {
                        if (Array.isArray(topic.questions)) {
                            topic.questions.forEach((question) => {
                                allTopicQuestions.push(question);
                            });
                        }
                    });
                });

                const correctQuestionSet = new Set();
                const incorrectQuestionSet = new Set();
                const skippedQuestionSet = new Set();

                getAllUserQuestion.forEach((test) => {
                    if (test.corrected_questions) {
                        test.corrected_questions.forEach((q) => {
                            if (!correctQuestionSet.has(q._id.toString())) {
                                correctQuestionSet.add(q._id.toString());
                                correctQuestions.push(q);
                            }
                        });
                    }

                    if (test.wrong_questions) {
                        test.wrong_questions.forEach((q) => {
                            if (!incorrectQuestionSet.has(q._id.toString())) {
                                incorrectQuestionSet.add(q._id.toString());
                                incorrectQuestions.push(q);
                            }
                        });
                    }

                    if (test.skipped_questions) {
                        test.skipped_questions.forEach((q) => {
                            if (!skippedQuestionSet.has(q._id.toString())) {
                                skippedQuestionSet.add(q._id.toString());
                                skippedQuestions.push(q);
                            }
                        });
                    }
                });

                const finalSkippedQuestions = skippedQuestions.reduce(
                    (acc, skippedQuestion) => {
                        const topicId = skippedQuestion.topic_id;
                        const topicQuestions =
                            topicId && topicId.questions
                                ? topicId.questions
                                : [];

                        const existingTopic = acc.find(
                            (item) =>
                                item.topic_id._id.toString() ===
                                topicId._id.toString()
                        );

                        const filteredQuestions = topicQuestions.filter(
                            (questionId) => {
                                return (
                                    skippedQuestion._id.toString() ===
                                    questionId.toString()
                                );
                            }
                        );

                        if (existingTopic) {
                            existingTopic.topic_id.questions +=
                                filteredQuestions.length;
                        } else {
                            acc.push({
                                topic_id: {
                                    _id: topicId._id,
                                    topic_name: topicId.title,
                                    questions: filteredQuestions.length,
                                },
                            });
                        }

                        return acc;
                    },
                    []
                );

                const finalCorrectQuestions = correctQuestions.reduce(
                    (acc, correctQuestion) => {
                        const topicId = correctQuestion.topic_id;
                        const topicQuestions =
                            topicId && topicId.questions
                                ? topicId.questions
                                : [];
                        const existingTopic = acc.find(
                            (item) =>
                                item.topic_id._id.toString() ===
                                topicId._id.toString()
                        );

                        const filteredQuestions = topicQuestions.filter(
                            (questionId) => {
                                return (
                                    correctQuestion._id.toString() ===
                                    questionId.toString()
                                );
                            }
                        );

                        if (existingTopic) {
                            existingTopic.topic_id.questions +=
                                filteredQuestions.length;
                        } else {
                            acc.push({
                                topic_id: {
                                    _id: topicId._id,
                                    topic_name: topicId.title,
                                    questions: filteredQuestions.length,
                                },
                            });
                        }

                        return acc;
                    },
                    []
                );

                const finalInCorrectQuestions = incorrectQuestions.reduce(
                    (acc, inCorrectQuestion) => {
                        const topicId = inCorrectQuestion.topic_id;
                        const topicQuestions =
                            topicId && topicId.questions
                                ? topicId.questions
                                : [];

                        const existingTopic = acc.find(
                            (item) =>
                                item.topic_id._id.toString() ===
                                topicId._id.toString()
                        );

                        const filteredQuestions = topicQuestions.filter(
                            (questionId) => {
                                return (
                                    inCorrectQuestion._id.toString() ===
                                    questionId.toString()
                                );
                            }
                        );

                        if (existingTopic) {
                            existingTopic.topic_id.questions +=
                                filteredQuestions.length;
                        } else {
                            acc.push({
                                topic_id: {
                                    _id: topicId._id,
                                    topic_name: topicId.title,
                                    questions: filteredQuestions.length,
                                },
                            });
                        }

                        return acc;
                    },
                    []
                );

                const usedQuestionIds = new Set([
                    ...correctQuestions.map((q) => q._id.toString()),
                    ...incorrectQuestions.map((q) => q._id.toString()),
                    ...skippedQuestions.map((q) => q._id.toString()),
                ]);

                const finalUnusedQuestionss = allTopicQuestions.reduce(
                    (acc, topic) => {
                        const topicId = topic.topic_id;

                        const topicQuestions = topicId?.questions || [];

                        const filteredQuestions = topicQuestions.filter(
                            (qId) => !usedQuestionIds.has(qId.toString())
                        );

                        if (filteredQuestions.length > 0) {
                            const existingTopic = acc.find(
                                (t) => t.topic_id._id === topicId._id
                            );

                            if (!existingTopic) {
                                acc.push({
                                    topic_id: {
                                        _id: topicId._id,
                                        topic_name: topicId.title,
                                        questions: filteredQuestions.length,
                                    },
                                });
                            }
                        }

                        return acc;
                    },
                    []
                );

                const topicMap = new Map();

                const processQuestions = (questions, key) => {
                    questions.forEach(({ topic_id }) => {
                        const topicId = topic_id._id.toString();
                        if (!topicMap.has(topicId)) {
                            topicMap.set(topicId, {
                                topic_id: topicId,
                                topic_name: topic_id.topic_name,
                                unusedQuestions: 0,
                                correctQuestions: 0,
                                incorrectQuestions: 0,
                                skippedQuestions: 0,
                            });
                        }
                        topicMap.get(topicId)[key] += topic_id.questions;
                    });
                };

                processQuestions(finalUnusedQuestionss, "unusedQuestions");
                processQuestions(finalCorrectQuestions, "correctQuestions");
                processQuestions(finalInCorrectQuestions, "incorrectQuestions");
                processQuestions(finalSkippedQuestions, "skippedQuestions");

                const finalQuestions = Array.from(topicMap.values());

                const allSubjects = await Course.find({ _id: course_id })
                    .select("subjects")
                    .populate({
                        path: "subjects",
                        select: "name topics",
                    });
                const finalData = {
                    subjects: allSubjects,
                    topics: finalQuestions,
                };
                return res.status(200).send({
                    data: finalData,
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    }

    static async getAllUserTest(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = get(req?.query, "user_id", "");
            const type = get(req?.query, "type", "DIAGNOSTIC");
            const course_id = get(req?.query, "course_id", "");
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const sorting = get(req?.query, "sorting", "id DESC").split(" ");

            if (course_id) {
                const findAllUserTest = await TestService.getUserTest({
                    offset: parseInt(skip),
                    limit: parseInt(size),
                    search,
                    sorting,
                    user_id,
                    type,
                    course_id,
                });

                if (findAllUserTest.data.length > 0) {
                    return res
                        .status(200)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.SUCCESS,
                                "all user test fetched succesffully",
                                findAllUserTest
                            )
                        );
                } else {
                    return res
                        .status(200)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.SUCCESS,
                                "user havent attempted any test"
                            )
                        );
                }
            } else {
                const findAllUserTest = await TestService.getUserTest({
                    offset: parseInt(skip),
                    limit: parseInt(size),
                    search,
                    sorting,
                    user_id,
                    type,
                });
                if (findAllUserTest.data.length > 0) {
                    return res
                        .status(200)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.SUCCESS,
                                "all user test fetched succesffully",
                                findAllUserTest
                            )
                        );
                } else {
                    return res
                        .status(200)
                        .send(
                            sendResponse(
                                RESPONSE_TYPE.SUCCESS,
                                "user havent attempted any test"
                            )
                        );
                }
            }
        } catch (error) {
            console.log("getAllUserTest", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async getActiveUserTest(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const _id = get(req?.query, "_id", "");
            const user_id = get(req?.query, "user_id", "");
            const testType = get(req?.query, "test_type", "");
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            "test id is invalid",
                            _id
                        )
                    );
            }

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            " user id is invalid",
                            _id
                        )
                    );
            }

            const findActiveUserTest = await TestService.getCurrentActiveTest(
                _id,
                user_id,
                testType
            );
            if (findActiveUserTest !== null) {
                return res
                    .status(200)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.SUCCESS,
                            " user test fetched succesffully",
                            findActiveUserTest
                        )
                    );
            } else {
                return res
                    .status(200)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.SUCCESS,
                            "user havent started any test"
                        )
                    );
            }
        } catch (error) {
            console.log("getAllUserTest", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async submitQuestion(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const question_id = get(req?.body, "question_id", "");
            const test_id = get(req?.body, "test_id", "");
            const selected_option_id = get(
                req?.body,
                "selected_option_id",
                null
            );

            if (!mongoose.Types.ObjectId.isValid(question_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            " test id is invalid",
                            test_id
                        )
                    );
            }

            if (!mongoose.Types.ObjectId.isValid(question_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            " question id is invalid",
                            question_id
                        )
                    );
            }

            const isTestAlreadySubmitted = await Test.findOne({
                _id: new mongoose.Types.ObjectId(test_id),
                status: "SUBMITTED",
            });
            if (isTestAlreadySubmitted) {
                return res.status(400).send({
                    message: "test already submitted",
                });
            }

            const submitUserQuestion = await TestService.submitQuestion({
                question_id,
                test_id,
                selected_option_id,
            });
            if (submitUserQuestion !== null) {
                return res.status(200).send({
                    success: true,
                    message: " question submitted succesffully",
                });
            }
        } catch (error) {
            console.log("submitQuestion", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async submitTest(req: Request, res: Response, next: NextFunction) {
        try {
            const test_id = get(req?.body, "test_id", "");
            const user_id = (req as any).user.id;

            if (!mongoose.Types.ObjectId.isValid(test_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            " test id is invalid",
                            test_id
                        )
                    );
            }

            const isTestAlreadySubmitted = await Test.findOne({
                _id: new mongoose.Types.ObjectId(test_id),
                status: "SUBMITTED",
            });
            if (isTestAlreadySubmitted) {
                return res.status(400).send({
                    message: "test already submitted",
                });
            }
            const testSubmitted = await TestService.submitTest({
                test_id,
                user_id,
            });
            if (testSubmitted !== null) {
                if (user_id) {
                    await User.findOneAndUpdate(
                        { _id: user_id },
                        { ongoing_test_id: "" }
                    );
                }
                return res.status(200).send({
                    success: true,
                    message: "Test Submitted",
                });
            }
        } catch (error) {
            console.log("getAllUserTest", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async handlePerQuestionTime(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const action = get(req?.body, "action", "");
            const current_question_id = get(
                req?.body,
                "current_question_id",
                ""
            );
            const new_question_id = get(req?.body, "new_question_id", null);
            const upcoming_question_id = get(
                req?.body,
                "upcoming_question_id",
                null
            );
            const test_id = get(req?.body, "test_id", "");

            const actionNoted = await TestService.handlePerQuestionTime({
                action,
                current_question_id,
                new_question_id,
                upcoming_question_id,
                test_id,
            });

            if (actionNoted) {
                return res.status(200).send({
                    success: true,
                    message: " test report fetched succesffully",
                    data: actionNoted,
                });
            }
        } catch (error) {
            console.log("handleBackNextTime", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async getTestReport(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const test_id = get(req?.params, "id", "");

            if (!mongoose.Types.ObjectId.isValid(test_id)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            " test id is invalid",
                            test_id
                        )
                    );
            }

            const isTestAlreadySubmitted = await Test.findOne({
                _id: new mongoose.Types.ObjectId(test_id),
                status: "SUBMITTED",
            });
            if (isTestAlreadySubmitted === null) {
                return res.status(400).send({
                    message: "test not submitted yet",
                });
            }
            const testSubmitted = await TestService.getTestReport(test_id);
            if (testSubmitted !== null) {
                return res.status(200).send({
                    success: true,
                    message: " test report fetched succesffully",
                    data: testSubmitted,
                });
            }
        } catch (error) {
            console.log("getAllUserTest", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async addBookmarkQuestions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const question_id = get(req?.body, "question_id", "");
            const test_id = get(req?.body, "test_id", "");
            const user_id = (req as any).user.id;
            const bookmarkedAdded = await TestService.bookmarkQuestions(
                question_id,
                user_id,
                test_id
            );
            if (bookmarkedAdded !== null) {
                return res.status(200).send({
                    success: true,
                    message: " bookmark added succesffully",
                });
            }
        } catch (error) {
            console.log("BookmarkQuestions", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async removeBookmarkQuestions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const question_id = get(req?.body, "question_id", "");
            const test_id = get(req?.body, "test_id", "");
            const user_id = (req as any).user.id;

            const bookmarkedAdded = await TestService.removeBookmarkQuestions(
                question_id,
                user_id,
                test_id
            );
            if (bookmarkedAdded !== null) {
                return res.status(200).send({
                    success: true,
                    message: " bookmark removed succesffully",
                });
            }
        } catch (error) {
            console.log("BookmarkQuestions", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async getAllTestBookmark(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const test_id = get(req?.params, "id", "");

            const user_id = (req as any).user.id;

            const allBookmarks = await TestService.getAllBookmark(
                test_id,
                user_id
            );
            if (allBookmarks.length > 0) {
                return res.status(200).send({
                    success: true,
                    message: " all bookmark fetched succesffully",
                    data: allBookmarks,
                });
            }
        } catch (error) {
            console.log("getAllTestBookmark", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async PerformanceDashboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const course_id = get(req?.body, "course_id", "");
            const type = get(req?.body, "type", "DIAGNOSTIC");
            const user_id = (req as any).user.id;

            const allTestOfUser = await Test.findOne({
                course_id: new mongoose.Types.ObjectId(course_id),
                user_id: user_id,
                type: type,
            });

            if (allTestOfUser !== null) {
                return res.status(200).send({
                    success: true,
                    message: " all user performaence fetched succesffully",
                });
            }
        } catch (error) {
            console.log("PerformanceDashboard", error);
            return res.status(500).send({
                message: "interal server error",
            });
        }
    }

    static async viewCurrentUserTestPerformance(
        req: Request,
        res: Response,
        next: NextFunction
    ) {try {

        const course_id = get(req?.params, "id", "");
        const user_id = (req as any).user.id;
        
        const allTestOfUserStats = await TestService.viewCurrentUserTestPerformance(
            course_id,
            user_id
        );

        if (allTestOfUserStats !== null) {
            return res.status(200).send({
                success: true,
                message: "All User Test performance stats fetched successfully",
                data:allTestOfUserStats
            });
        }

    } catch (error) {
        console.log("viewCurrentUserTestPerformance", error);
        return res.status(500).send({
            message: "interal server error",
        });
    }}
}
