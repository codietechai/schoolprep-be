import {
    getUserTest,
    handlePerQuestionTimeType,
    submitQuestionType,
    submitTestType,
    TAddTest,
} from "admin/controllers/Test/types";
import { Course, Question, User } from "database/schema";
import { Test } from "database/schema/Test";
import { TestActivity } from "database/schema/test-activity";
import mongoose from "mongoose";
import { Question as QuestionModel } from "database/schema";

export class TestModal {
    public async getOngoingTestId(user_id: string) {
        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(user_id),
        });
        return user;
    }

    public async createTest(data: TAddTest) {
        const newTest = await Test.create(data);
        return newTest;
    }

    public async getCurrentActiveTest(
        _id: string,
        user_id: string,
        testType: string
    ) {
        const getActiveUserTest = await Test.findOne({
            _id: new mongoose.Types.ObjectId(_id),
            user_id: new mongoose.Types.ObjectId(user_id),
        })
            .populate({ path: "topics", select: "title" })
            .populate({
                path: "questions",
                select: "question_text options image_url explanation_text explanation_image explanation_video  ",
                transform: (doc) => {
                    if (testType === "DIAGNOSTIC") {
                        doc.options = doc.options.map((option) => ({
                            text: option.text,
                            _id: option._id,
                        }));
                        return doc;
                    } else {
                        return doc;
                    }
                },
            });
        return getActiveUserTest;
    }

    public async getDiagnosticTestCountAndTime(course_id: string) {
        const result = await Course.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(course_id) } },
            { $unwind: "$selected_topic_for_exam" },
            {
                $lookup: {
                    from: "topics",
                    localField: "selected_topic_for_exam",
                    foreignField: "_id",
                    as: "topic",
                },
            },
            { $unwind: "$topic" },
            {
                $group: {
                    _id: course_id,
                    totalAllowedQuestions: { $sum: "$topic.allowed_questions" },
                    totalTime: { $first: "$diagnostic_test_time" },
                },
            },
        ]);

        const totalAllowedQuestions = result[0]?.totalAllowedQuestions || 0;

        return result;
    }

    public async getUserTest(data: getUserTest) {
        const where: any = {};

        if (data.search) {
            where.$or = [{ name: { $regex: data.search, $options: "i" } }];
        }

        let colName = data?.sorting ? data.sorting[0] : "";
        if (colName === "id") {
            colName = "_id";
        }
        let sortObj = {};
        if (data.sorting) {
            sortObj = { [colName]: data.sorting[1] === "ASC" ? 1 : -1 };
        }

        if (data.course_id !== "" && data.course_id !== undefined) {
            const baseQuery = {
                user_id: new mongoose.Types.ObjectId(data.user_id),
                type: data.type,
                course_id: data.course_id,
            };
            const total = await Test.countDocuments({ ...baseQuery, ...where });

            const getAllUserTest = await Test.find({ ...baseQuery, ...where })
                .populate({ path: "topics", select: "title" })
                .populate({
                    path: "questions",
                    select: "question_text options  image_url explanation_text explanation_image explanation_video  ",
                    transform: (doc) => {
                        doc.options = doc.options.map((option) => ({
                            text: option.text,
                        }));
                        return doc;
                    },
                })
                .skip(data.offset)
                .limit(data.limit)
                .sort(sortObj);
            return { total, data: getAllUserTest };
        } else {
            const baseQuery = {
                user_id: new mongoose.Types.ObjectId(data.user_id),
                type: data.type,
            };

            const total = await Test.countDocuments({ ...baseQuery, ...where });
            const getAllUserTest = await Test.find({ ...baseQuery, ...where })
                .populate({ path: "topics", select: "title" })
                .populate({
                    path: "questions",
                    select: "question_text test_mode correct skipped createdAt submittedAt total_questions image_url explanation_text explanation_image explanation_video  ",
                    transform: (doc) => {
                        doc.options = doc?.options?.map((option) => ({
                            text: option.text,
                        }));
                        return doc;
                    },
                })
                .skip(data.offset)
                .limit(data.limit)
                .sort(sortObj);

            return { total, data: getAllUserTest };
        }
    }

    public async submitQuestion(data: submitQuestionType) {
        const isTestExist = await Test.findById(data.test_id);
        if (!isTestExist) {
            throw new Error("Test not found.");
        }

        const findAllocatedTimePerQuestion = await TestActivity.findOne({
            current_question_id: data.question_id,
            test_id: data.test_id,
        });

        const updatedTest = await Test.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(data.test_id),
                "progress.question": data.question_id,
                $or: [{ status: "ACTIVE" }, { status: "PAUSED" }],
            },
            {
                $set: {
                    "progress.$.selected_option":
                        data?.selected_option_id || null,
                    "progress.$.time_taken": findAllocatedTimePerQuestion?._id,
                },
            },
            { new: true }
        );

        if (!updatedTest) {
            const updatedTestWithNewEntry = await Test.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(data.test_id) },
                {
                    $push: {
                        progress: {
                            question: data.question_id,
                            selected_option: data?.selected_option_id || null,
                            time_taken: findAllocatedTimePerQuestion?._id,
                        },
                    },
                },
                { new: true }
            );
            return updatedTestWithNewEntry;
        }

        return updatedTest;
    }

    public async submitTest(data: submitTestType) {
        const findTest = await Test.findById(data.test_id)
            .populate("questions")
            .populate("progress.question");

        let corrected_questions_of_current_exam = [];
        let skippedQuestions_of_current_exam = [];

        findTest.progress.forEach((userChoosenAnswer) => {
            const question: any = findTest.questions.find(
                (q) =>
                    q._id.toString() ===
                    userChoosenAnswer.question._id.toString()
            );

            if (question && question.options) {
                if (
                    question.options.some(
                        (option) =>
                            option._id.toString() ===
                                userChoosenAnswer.selected_option &&
                            option.isCorrect
                    )
                ) {
                    corrected_questions_of_current_exam.push(userChoosenAnswer);
                }
            }
        });
        findTest.progress.forEach((userChoosenAnswer) => {
            if (userChoosenAnswer.selected_option === null) {
                skippedQuestions_of_current_exam.push(userChoosenAnswer);
            }
        });

        let total_time = 0;

        const perQuestionTime = await TestActivity.find({
            test_id: data.test_id,
        });

        for (const time of perQuestionTime) {
            total_time += time.previous_time_in_seconds
                ? time.previous_time_in_seconds
                : 0;
        }

        const test_percentage = findTest.total_questions
            ? (
                  corrected_questions_of_current_exam.length /
                  findTest.total_questions
              ).toFixed(2)
            : 0;

        const attemptedQuestions = findTest.progress.length;

        const response = await Test.findOneAndUpdate(
            {
                _id: data.test_id,
                status: "ACTIVE",
            },
            {
                status: "SUBMITTED",
                submitted_at: new Date(),
                corrected_questions: corrected_questions_of_current_exam.length,
                skipped_questions: skippedQuestions_of_current_exam.length,
                wrong_questions:
                    attemptedQuestions -
                    (corrected_questions_of_current_exam.length +
                        skippedQuestions_of_current_exam.length),
                total_time: total_time,
                test_percentage: test_percentage,
            },
            { new: true }
        );

        const wrong_questions_of_current_exam = findTest.progress
            .filter((q) => {
                return (
                    !corrected_questions_of_current_exam.some((i) => {
                        return (
                            i.question._id.toString() ===
                            q.question._id.toString()
                        );
                    }) &&
                    !skippedQuestions_of_current_exam.some((i) => {
                        return (
                            i.question._id.toString() ===
                            q.question._id.toString()
                        );
                    })
                );
            })
            .map((q) => q.question);

        const correctedQuestionIds = corrected_questions_of_current_exam.map(
            (q) => q.question._id
        );

        const skippedQuestionIds = skippedQuestions_of_current_exam.map(
            (q) => q.question._id
        );
        const wrongQuestionIds = wrong_questions_of_current_exam;

        const datauser = await User.findOneAndUpdate(
            { _id: data.user_id },
            {
                $addToSet: {
                    corrected_questions: { $each: correctedQuestionIds },
                    skipped_questions: { $each: skippedQuestionIds },
                    wrong_questions: { $each: wrongQuestionIds },
                },
            },
            { new: true }
        );

        const existingUserTestQuestions = await User.findOne({
            _id: data.user_id,
        });

        if (!existingUserTestQuestions) {
            throw new Error("User not found");
        }

        let updatedWrong;
        let updatedSkipped;
        let updatedCorrected;

        if (existingUserTestQuestions.wrong_questions.length) {
            updatedWrong = existingUserTestQuestions.wrong_questions.filter(
                (qId) => {
                    return (
                        !skippedQuestionIds
                            .toString()
                            .includes(qId.toString()) &&
                        !correctedQuestionIds
                            .toString()
                            .includes(qId.toString())
                    );
                }
            );
        }
        if (existingUserTestQuestions.skipped_questions.length) {
            updatedSkipped = existingUserTestQuestions.skipped_questions.filter(
                (qId) => {
                    return (
                        !wrongQuestionIds.toString().includes(qId.toString()) &&
                        !correctedQuestionIds
                            .toString()
                            .includes(qId.toString())
                    );
                }
            );
        }

        if (existingUserTestQuestions.corrected_questions.length) {
            updatedCorrected =
                existingUserTestQuestions.corrected_questions.filter((qId) => {
                    return (
                        !wrongQuestionIds.toString().includes(qId.toString()) &&
                        !skippedQuestionIds.toString().includes(qId.toString())
                    );
                });
        }

        const datad = await User.findOneAndUpdate(
            { _id: data.user_id },
            {
                $set: {
                    corrected_questions: updatedCorrected,
                    skipped_questions: updatedSkipped,
                    wrong_questions: updatedWrong,
                },
            },
            { new: true }
        );

        return response;
    }

    public async handlePerQuestionTime(data: handlePerQuestionTimeType) {
        const {
            action,
            current_question_id,
            new_question_id,
            test_id,
            upcoming_question_id,
        } = data;

        if (action === "BACK") {
            const currentQuestionWithNoRevision = await TestActivity.findOne({
                current_question_id: current_question_id,
                test_id: test_id,
                revisted_at: null,
            });

            await Test.findOneAndUpdate(
                {
                    _id: new mongoose.Types.ObjectId(test_id),
                },
                {
                    current_question_id: new_question_id,
                }
            );

            if (currentQuestionWithNoRevision) {
                const timeSpent = Math.floor(
                    (new Date().getTime() -
                        new Date(
                            currentQuestionWithNoRevision.started_at
                        ).getTime()) /
                        1000
                );

                currentQuestionWithNoRevision.ended_at = new Date();
                currentQuestionWithNoRevision.previous_time_in_seconds =
                    timeSpent;
                await currentQuestionWithNoRevision.save();

                const backAction = await TestActivity.findOneAndUpdate(
                    {
                        current_question_id: new_question_id,
                        test_id,
                    },
                    {
                        revisted_at: new Date(),
                    }
                );

                await Test.findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(test_id),
                    },
                    {
                        current_question_id: new_question_id,
                    }
                );

                return backAction;
            } else {
                const currentQuestionWithRevision = await TestActivity.findOne({
                    current_question_id: current_question_id,
                    test_id: test_id,
                });
                if (currentQuestionWithRevision) {
                    const timeSpent = Math.floor(
                        (new Date().getTime() -
                            new Date(
                                currentQuestionWithRevision.revisted_at
                            ).getTime()) /
                            1000
                    );

                    currentQuestionWithRevision.ended_at = new Date();
                    currentQuestionWithRevision.previous_time_in_seconds +=
                        timeSpent;
                    await currentQuestionWithRevision.save();

                    const backAction = await TestActivity.findOneAndUpdate(
                        {
                            current_question_id: new_question_id,
                            test_id,
                        },
                        {
                            revisted_at: new Date(),
                        }
                    );
                    await Test.findOneAndUpdate(
                        {
                            _id: new mongoose.Types.ObjectId(test_id),
                        },
                        {
                            current_question_id: new_question_id,
                        }
                    );

                    return backAction;
                }
            }
        }

        if (action === "NEXT") {
            const currentQuestion = await TestActivity.findOne({
                test_id: new mongoose.Types.ObjectId(test_id),
                current_question_id: new mongoose.Types.ObjectId(
                    current_question_id
                ),
                revisted_at: null,
            });

            if (currentQuestion) {
                const timeSpent = Math.floor(
                    (new Date().getTime() -
                        new Date(currentQuestion.started_at).getTime()) /
                        1000
                );

                currentQuestion.ended_at = new Date();
                currentQuestion.previous_time_in_seconds = timeSpent;
                await currentQuestion.save();
                await Test.findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(test_id),
                    },
                    {
                        current_question_id: new_question_id,
                    }
                );

                const isNextQuestionExist = await TestActivity.findOne({
                    test_id: new mongoose.Types.ObjectId(test_id),
                    current_question_id: new mongoose.Types.ObjectId(
                        new_question_id
                    ),
                });
                const isLastQuestion = await TestActivity.findOne({
                    test_id: new mongoose.Types.ObjectId(test_id),
                    current_question_id: new mongoose.Types.ObjectId(
                        current_question_id
                    ),
                    new_question_id: null,
                });
                if (isLastQuestion) {
                    return isLastQuestion;
                }

                if (isNextQuestionExist === null && isLastQuestion === null) {
                    const nextAction = await TestActivity.create({
                        action,
                        current_question_id: new_question_id,
                        new_question_id: upcoming_question_id,
                        test_id,
                        started_at: new Date(),
                    });

                    await Test.findOneAndUpdate(
                        {
                            _id: new mongoose.Types.ObjectId(test_id),
                        },
                        {
                            current_question_id: new_question_id,
                        }
                    );

                    return nextAction;
                }
                return isNextQuestionExist;
            } else if (currentQuestion === null) {
                const currentQuestionWithRevision = await TestActivity.findOne({
                    current_question_id: new mongoose.Types.ObjectId(
                        current_question_id
                    ),
                    test_id: new mongoose.Types.ObjectId(test_id),
                });
                const newQuestion = await TestActivity.findOne({
                    current_question_id: new mongoose.Types.ObjectId(
                        new_question_id
                    ),
                    test_id: new mongoose.Types.ObjectId(test_id),
                    ended_at: { $exists: true },
                });
                if (newQuestion) {
                    newQuestion.revisted_at = new Date();
                    await newQuestion.save();
                }

                if (currentQuestionWithRevision) {
                    const timeSpent = Math.floor(
                        (new Date().getTime() -
                            new Date(
                                currentQuestionWithRevision.revisted_at
                            ).getTime()) /
                            1000
                    );

                    currentQuestionWithRevision.ended_at = new Date();
                    currentQuestionWithRevision.revisted_at = new Date();
                    currentQuestionWithRevision.previous_time_in_seconds +=
                        timeSpent;
                    await currentQuestionWithRevision.save();

                    await Test.findOneAndUpdate(
                        {
                            _id: new mongoose.Types.ObjectId(test_id),
                        },
                        {
                            current_question_id: new_question_id,
                        }
                    );

                    const isNextQuestionExist = await TestActivity.findOne({
                        current_question_id: new mongoose.Types.ObjectId(
                            new_question_id
                        ),
                        test_id: new mongoose.Types.ObjectId(test_id),
                    });
                    const isLastQuestion = await TestActivity.findOne({
                        test_id: new mongoose.Types.ObjectId(test_id),
                        current_question_id: new mongoose.Types.ObjectId(
                            current_question_id
                        ),
                        new_question_id: null,
                    });

                    if (
                        isNextQuestionExist === null &&
                        isLastQuestion === null
                    ) {
                        const nextAction = await TestActivity.create({
                            action,
                            current_question_id: new_question_id,
                            new_question_id: upcoming_question_id,
                            test_id,
                            started_at: new Date(),
                        });

                        await Test.findOneAndUpdate(
                            {
                                _id: new mongoose.Types.ObjectId(test_id),
                            },
                            {
                                current_question_id: new_question_id,
                            }
                        );
                        return nextAction;
                    }
                    return isNextQuestionExist;
                } else {
                    const nextAction = await TestActivity.create({
                        action,
                        current_question_id: current_question_id,
                        new_question_id: new_question_id,
                        test_id,
                        started_at: new Date(),
                    });

                    const data = await Test.findOneAndUpdate(
                        {
                            _id: new mongoose.Types.ObjectId(test_id),
                        },
                        {
                            current_question_id: current_question_id,
                        }
                    );
                    return nextAction;
                }
            }
        }
    }

    public async getTestReport(test_id: string) {
        const response = await Test.findOne({
            _id: new mongoose.Types.ObjectId(test_id),
            status: "SUBMITTED",
        })
            .populate("questions")
            .populate("progress.question")
            .populate({
                path: "topics.topic_id",
                select: "subject title",
                populate: {
                    path: "subject",
                    select: "name",
                },
            })
            .populate({
                path: "progress.time_taken",
                select: "previous_time_in_seconds",
            });

        return response;
    }

    public async bookmarkQuestions(
        question_id: string,
        user_id: string,
        test_id: string
    ) {
        const allTestOfUser = await Test.findOneAndUpdate(
            {
                _id: test_id,
                user_id: user_id,
            },
            {
                $addToSet: {
                    bookmark_questions: new mongoose.Types.ObjectId(
                        question_id
                    ),
                },
            },
            { new: true }
        );
        return allTestOfUser;
    }

    public async removeBookmarkQuestions(
        question_id: string,
        user_id: string,
        test_id: string
    ) {
        const removeQuestionFromBookmark = await Test.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(test_id),
                user_id: user_id,
            },
            {
                $pull: {
                    bookmark_questions: new mongoose.Types.ObjectId(
                        question_id
                    ),
                },
            },
            { new: true }
        );

        return removeQuestionFromBookmark;
    }

    public async getAllBookmark(test_id: string, user_id: string) {
        const allBookmark = await Test.find({
            _id: test_id,
            user_id: user_id,
        }).select("bookmark_questions");

        return allBookmark;
    }

    public async viewCurrentUserTestPerformance(course_id: string, user_id: string) {
        const courseSpecificTestAnalysis = await User.find({ _id: new mongoose.Types.ObjectId(user_id) })
            .populate({
                path: "corrected_questions",
                match: { course_id: course_id },
                select: "_id subject_id topic_id",
                populate: [
                    { path: "subject_id", select: "name" },
                    { path: "topic_id", select: "title" }
                ]
            })
            .populate({
                path: "wrong_questions",
                match: { course_id: course_id },
                select: "_id subject_id topic_id",
                populate: [
                    { path: "subject_id", select: "name" },
                    { path: "topic_id", select: "title" }
                ]
            })
            .populate({
                path: "skipped_questions",
                match: { course_id: course_id },
                select: "_id subject_id topic_id",
                populate: [
                    { path: "subject_id", select: "name" },
                    { path: "topic_id", select: "title" }
                ]
            })
            .select("corrected_questions wrong_questions skipped_questions")
            .exec();
    
        const subjectMap = new Map<string, any>();
    
        for (const user of courseSpecificTestAnalysis) {
            for (const questionType of ["corrected_questions", "wrong_questions", "skipped_questions"]) {
                for (const question of user[questionType]) {
                    const { subject_id, topic_id } = question;
                    if (!subject_id || !topic_id) continue;
    
                    const subjectKey = subject_id._id.toString();
                    const topicKey = topic_id._id.toString();
    
                    if (!subjectMap.has(subjectKey)) {
                        const subjectTotalCount=await Question.find({subject_id:subjectKey}).countDocuments();
                        subjectMap.set(subjectKey, {
                            _id: subjectKey,
                            name: subject_id.name,
                            correct_questions: 0,
                            wrong_questions: 0,
                            skipped_questions: 0,
                            total_questions: 0,
                            topics: new Map(),
                            total_subject_questions: 0,
                        });
                    }
    
                    const subject = subjectMap.get(subjectKey);
    
                    if (!subject.topics.has(topicKey)) {
                        subject.topics.set(topicKey, {
                            _id: topicKey,
                            title: topic_id.title,
                            correct_questions: 0,
                            wrong_questions: 0,
                            skipped_questions: 0,
                            total_questions: 0,
                            subject_id: subjectKey,
                            total_topic_questions: 0 // Placeholder for total questions per topic
                        });
                    }
    
                    const topic = subject.topics.get(topicKey);
    
                    if (questionType === "corrected_questions") {
                        subject.correct_questions++;
                        topic.correct_questions++;
                    } else if (questionType === "wrong_questions") {
                        subject.wrong_questions++;
                        topic.wrong_questions++;
                    } else if (questionType === "skipped_questions") {
                        subject.skipped_questions++;
                        topic.skipped_questions++;
                    }
    
                    subject.total_questions++;
                    topic.total_questions++;
                }
            }
        }
    
        // Fetch total questions for each subject
        for (const [subjectKey, subject] of subjectMap) {
            subject.total_subject_questions = await QuestionModel.countDocuments({
                course_id: course_id,
                subject_id: subjectKey
            });
    
            // Fetch total questions for each topic within the subject
            for (const [topicKey, topic] of subject.topics) {
                topic.total_topic_questions = await QuestionModel.countDocuments({
                    course_id: course_id,
                    subject_id: subjectKey,
                    topic_id: topicKey
                });
            }
        }
    
        const responseData = Array.from(subjectMap.values()).map((subject) => ({
            ...subject,
            topics: Array.from(subject.topics.values())
        }));
    
        return responseData;
    }
    
    
}
