import { Question as QuestionModel } from "database/schema";
import {
    TListFilters,
    TAddQuestion,
    TEditQuestion,
} from "admin/controllers/questions/types";
import { Topic as TopicModel } from "database/schema";
export class Question {
    constructor() {}

    public async getQuestions(filters: TListFilters): Promise<any> {
        const where: any = {};

        if (filters.search) {
            where.question_text = { $regex: filters.search, $options: "i" };
        }

        let colName = filters?.sorting ? filters.sorting[0] : "";
        if (colName === "id") {
            colName = "_id";
        }
        let sortObj = {};
        if (filters.sorting) {
            sortObj = { [colName]: filters.sorting[1] === "ASC" ? 1 : -1 };
        }

        const total = await QuestionModel.countDocuments(where);
        const data = await QuestionModel.find(where)
            .skip(filters.offset)
            .limit(filters.limit)
            .sort(sortObj);

        return { total, data };
    }

    private parseSorting(sorting: string): any {
        const [field, direction] = sorting.split(" ");
        const sortObj: any = {};
        sortObj[field] = direction === "asc" ? 1 : -1;
        return sortObj;
    }

    public async addQuestion(data: TAddQuestion): Promise<any> {
        const newQuestion = await QuestionModel.create(data);
        if (newQuestion) {
            const addQuestionIdInTopic = await TopicModel.findOneAndUpdate(
                { _id: data.topic_id },
                { $addToSet: { questions: newQuestion._id } },
                { new: true }
            );
            if (addQuestionIdInTopic) {
                return newQuestion;
            } else {
                return "some issue in adding topic in subject";
            }
        }
        return newQuestion;
    }

    public async getQuestionByText(question_text: string): Promise<any> {
        const question = await QuestionModel.findOne({
            question_text,
        });
        return question;
    }

    public async getQuestionById(id: string): Promise<any> {
        const question = await QuestionModel.findById(id);
        return question ? question : null;
    }

    public async updateQuestion(id: string, data: TEditQuestion): Promise<any> {
        const question = await QuestionModel.findById(id);

        const addQuestionIdInTopic = await TopicModel.findOneAndUpdate(
            { _id: data.topic_id },
            { $addToSet: { questions: question._id } },
            { new: true }
        );
        if (!question) return null;

        await question.updateOne(data);
        return question;
    }

    public async deleteQuestions(ids: string[]): Promise<number> {
        const response = await QuestionModel.deleteMany({
            _id: { $in: ids },
        });
        return response.deletedCount;
    }

    public async updateQuestionImage(id: string, data: any) {
        const question = await QuestionModel.findById(id);
        if (!question) return null;

        await QuestionModel.updateOne({ _id: id }, { $set: data });
        return question;
    }

    public async getCourseQuestions(
        courseId: string,
        filters: TListFilters
    ): Promise<any> {
        const where: any = { course_id: courseId };

        if (filters.search) {
            where.question_text = { $regex: filters.search, $options: "i" };
        }

        const total = await QuestionModel.countDocuments(where);
        const data = await QuestionModel.find(where)
            .skip(filters.offset)
            .limit(filters.limit)
            .sort(filters.sorting ? this.parseSorting(filters.sorting) : {});

        return { total, data };
    }
}
