import { Course, Question, Role, User } from "server/database/schema";
import { Test } from "server/database/schema/Test";
import { lookup } from "dns";
import mongoose from "mongoose";

export class Dashboard {
    public async studentDashboard(course_id: string, user_id: string) {
        let total_prepatory_questions = 0;
        let total_diagnostic_questions = 0;
        let prep_corrected_questions = 0;
        let diag_corrected_questions = 0;
        let total_time_in_prepatory = 0;
        let total_time_in_diagnostic = 0;

        const allUserTests = await Test.find({
            course_id: course_id,
            user_id: user_id,
            type: { $in: ["PREPARATORY", "DIAGNOSTIC"] },
        }).select(
            "total_questions corrected_questions type createdAt total_time"
        );

        const time_in_prep = await Test.find({
            course_id: course_id,
            user_id: user_id,
            type: { $in: ["PREPARATORY"] },
        }).select(
            "total_questions corrected_questions type createdAt total_time"
        );
        const userHighestRank = await Test.findOne({
            user_id: user_id,
            course_id: course_id,
        })
            .sort({ corrected_questions: -1 })
            .limit(1)
            .select("corrected_questions");

        const alluserTestMarks = await Test.aggregate([
            {
                $match: {
                    course_id: new mongoose.Types.ObjectId(course_id),
                    type: "DIAGNOSTIC",
                },
            },
            {
                $sort: { user_id: 1, createdAt: -1 },
            },
            {
                $group: {
                    _id: "$user_id",
                    latestTest: { $first: "$$ROOT" },
                },
            },
            {
                $project: {
                    test_percentage: {
                        $ifNull: ["$latestTest.test_percentage", 0],
                    },
                    user_id: "$_id",
                    createdAt: "$latestTest.createdAt",
                },
            },
            {
                $limit: 100,
            },
        ]);
        const rankedUsers = alluserTestMarks.sort(
            (a, b) => b.test_percentage - a.test_percentage
        );

        let rank = 1;
        rankedUsers.forEach((user, index) => {
            if (
                index > 0 &&
                user.test_percentage < rankedUsers[index - 1].test_percentage
            ) {
                rank = index + 1;
            }
            user.rank = rank;
        });
        const maxTest = await Test.findOne(
            {
                course_id: new mongoose.Types.ObjectId(course_id),
                type: "DIAGNOSTIC",
            },
            { total_questions: 1 }
        ).sort({ total_questions: -1 });

        const maxMarks = maxTest ? maxTest.total_questions : 0;

        const fullMarksData = Array.from({ length: maxMarks + 1 }, (_, i) => ({
            marks: i,
            tests: 0,
        }));

        const resultMap = new Map(
            alluserTestMarks.map((entry) => [entry.marks, entry.tests])
        );

        const finalResult = fullMarksData.map((entry) => ({
            marks: entry.marks,
            tests: resultMap.get(entry.marks) || 0,
        }));

        const time_in_diag = await Test.find({
            course_id: course_id,
            user_id: user_id,
            type: { $in: ["DIAGNOSTIC"] },
        }).select(
            "total_questions corrected_questions type createdAt total_time"
        );

        for (const time of time_in_prep) {
            total_time_in_prepatory += time.total_time ? time.total_time : 0;
        }

        for (const time of time_in_diag) {
            total_time_in_diagnostic += time.total_time ? time.total_time : 0;
        }

        const UserPerformancePerDay = await Test.aggregate([
            {
                $match: {
                    course_id: new mongoose.Types.ObjectId(course_id),
                    user_id: new mongoose.Types.ObjectId(user_id),
                    type: "PREPARATORY",
                    createdAt: {
                        $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $project: {
                    total_questions: 1,
                    corrected_questions: 1,
                    type: 1,
                    createdAt: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: { date: "$createdAt", type: "$type" },
                    totalQuestions: { $sum: "$total_questions" },
                    correctedQuestions: { $sum: "$corrected_questions" },
                },
            },
            {
                $project: {
                    date: "$_id.date",
                    type: "$_id.type",
                    performance: {
                        $cond: {
                            if: { $eq: ["$totalQuestions", 0] },
                            then: 0,
                            else: {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$correctedQuestions",
                                            "$totalQuestions",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$date",
                    average_performance: { $avg: "$performance" },
                },
            },
            {
                $project: {
                    date: "$_id",
                    performance: { $round: ["$average_performance", 2] },
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        const courseQuestions = await Course.find({
            _id: course_id,
        })
            .select("subjects")
            .populate({
                path: "subjects",
                select: "topics",
                populate: {
                    path: "topics",
                    select: "questions is_preparatory",
                    populate: {
                        path: "questions",
                        match: { is_preparatory: true },
                        select: "is_preparatory",
                    },
                },
            });

        const userAttemptedQuestions = await User.findById(user_id)
            .select("corrected_questions wrong_questions skipped_questions")
            .populate({
                path: "corrected_questions",
                match: { course_id: course_id },
            })
            .populate({
                path: "wrong_questions",
                match: { course_id: course_id },
            })
            .populate({
                path: "skipped_questions",
                match: { course_id: course_id },
            });

        const total_questions = courseQuestions.reduce((count, course) => {
            return (
                count +
                course.subjects.reduce((subjectCount, subject) => {
                    return (
                        subjectCount +
                        (subject as any).topics.reduce((topicCount, topic) => {
                            return topicCount + topic.questions.length;
                        }, 0)
                    );
                }, 0)
            );
        }, 0);

        allUserTests.forEach((test) => {
            if (test.type === "PREPARATORY") {
                total_prepatory_questions += test.total_questions || 0;
                prep_corrected_questions += test.corrected_questions || 0;
            } else if (test.type === "DIAGNOSTIC") {
                total_diagnostic_questions += test.total_questions || 0;
                diag_corrected_questions += test.corrected_questions || 0;
            }
        });

        const prep_percentage =
            total_prepatory_questions > 0
                ? parseFloat(
                      (
                          (prep_corrected_questions /
                              total_prepatory_questions) *
                          100
                      ).toFixed(1)
                  )
                : 0;

        const diag_percentage =
            total_diagnostic_questions > 0
                ? parseFloat(
                      (
                          (diag_corrected_questions /
                              total_diagnostic_questions) *
                          100
                      ).toFixed(1)
                  )
                : 0;

        return {
            prep_percentage,
            diag_percentage,
            total_questions,
            corrected_questions:
                userAttemptedQuestions.corrected_questions.length,
            incorrect_questions: userAttemptedQuestions.wrong_questions.length,
            skipped_questions: userAttemptedQuestions.skipped_questions.length,
            user_performance_per_day: UserPerformancePerDay,
            total_time_of_prep: total_time_in_prepatory,
            total_time_of_diag: total_time_in_diagnostic,
            graph_data: finalResult,
            userHighestRank: userHighestRank,
            rankedUsers: rankedUsers,
        };
    }

    public async teacherDashboard() {
        const preparatoryQuestionCount = await Question.find({
            is_preparatory: true,
        }).countDocuments();
        const diagnosticQuestionCount = await Question.find({
            is_diagnostic: true,
        }).countDocuments();

        const totalQuestions = await Question.find().countDocuments();

        const particularCourseCount = await Question.aggregate([
            {
                $group: {
                    _id: "$course_id",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: "$courseDetails",
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    course_name: "$courseDetails.name",
                },
            },
        ]);

        return {
            totalQuestions,
            preparatoryQuestionCount,
            diagnosticQuestionCount,
            particularCourseCount,
        };
    }
    public async cordinatorDashboard() {

        const studentRole = await Role.findOne({ name: "Student" });

        if (!studentRole) {
            throw new Error("Student role not found");
        }

        const totalStudents = await User.countDocuments({
            role: studentRole._id,
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const pastWeekStudents = await User.aggregate([
            {
                $match: {
                    role: studentRole._id,
                    createdAt: { $gte: oneWeekAgo }, 
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%d-%m-%Y", date: "$createdAt" }, 
                    },
                    count: { $sum: 1 }, 
                },
            },
            {
                $sort: { _id: 1 }, 
            },
        ]);

        
        return {
            totalStudents,
            pastWeekStudents
        };
    }
}
