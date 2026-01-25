import {
    Topic as TopicModel,
    Subject as SubjectModel,
    Course as CourseModel,
} from "server/database/schema";
import {
    TListFilters,
    TAddTopic,
    TEditTopic,
    TAddTopicAllowedCount,
} from "admin/controllers/topic/types";

export class Topics {
    public async getTopics(subject: string) {
        const where: any = {};

        const total = await TopicModel.countDocuments({ ...where, subject });
        const data = await TopicModel.find({ ...where, subject });

        return { total, data };
    }

    public async addTopic(data: TAddTopic) {
        const newTopic = await TopicModel.create(data);

        const addTopicIdInSubjects = await SubjectModel.findOneAndUpdate(
            { _id: data.subject },
            { $addToSet: { topics: newTopic._id } },
            { new: true }
        );
        if (addTopicIdInSubjects) {
            return newTopic;
        } else {
            return "some issue in adding topic in subject";
        }
    }

    public async updateTopic(id: number, data: TEditTopic) {
        const topic = await TopicModel.findById(id);
        if (!topic) return null;

        await topic.updateOne(data);
        return topic;
    }

    public async getTopicById(id: number) {
        const topic = await TopicModel.findById(id);
        return topic ? topic : null;
    }

    public async deleteTopics(id: string) {
        const response = await TopicModel.deleteOne({
            _id: id,
        });
        return response.deletedCount;
    }

    public async addTopicAllowedQuestionsCount(data: TAddTopicAllowedCount) {
        const AllowedTopicCount = await TopicModel.findOneAndUpdate(
            { _id: data.topic_id },
            { allowed_questions: data.allowed_questions },
            { new: true }
        );
        return AllowedTopicCount

    }

    public async getCourseTopics(id: string) {
        const course = await CourseModel.findById(id)
            .select("subjects _id name active selected_topic_for_exam diagnostic_test_time")
            .populate({
                path: "subjects",
                select: "name _id topics",
                populate: {
                    path: "topics",
                    model: "Topic",
                    select: "_id title allowed_questions questions",
                },
            })
            .lean();

        let totalQuestions = 0;

        course.subjects.forEach((subject: any) => {
            if (subject.topics && Array.isArray(subject.topics)) {
                subject.topics.forEach((topic: any) => {
                    totalQuestions += topic.allowed_questions || 0;
                });
            }
        });

        return { data: course, totalQuestions };
    }
}
