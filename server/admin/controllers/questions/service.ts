import { Question, ImageCrud } from "admin/models";
import {
    TAddQuestion,
    TEditQuestion,
    TListFilters
} from "admin/controllers/questions/types";

export default class QuestionService {
    static async getQuestions(data: TListFilters) {
        const obj = new Question();
        const response = await obj.getQuestions(data);
        return response;
    }

    static async addQuestion(data: TAddQuestion, imageUrlBuffer: Buffer, image?: Buffer) {
        const obj = new Question();
        const resp = await obj.addQuestion(data);

        if (image && resp._id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `images/question/${resp._id}-${dateId}`;
            const imgRes = await img.uploadImage(image, fileName);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateQuestionImage(resp._id, { explanation_image: imageUrl });
        }

        if (imageUrlBuffer && resp._id) {
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `images/question/${resp._id}-${dateId}`;
            const imgRes = await img.uploadImage(imageUrlBuffer, fileName);
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateQuestionImage(resp._id, { image_url: imageUrl });
        }

        return resp;
    }

    static async getQuestionById(id: string) {
        const obj = new Question();
        const response = await obj.getQuestionById(id);
        return response;
    }

    static async getQuestionByText(question_text: string) {
        const obj = new Question();
        const response = await obj.getQuestionByText(question_text);
        return response;
    }

    static async updateQuestion(id: string, data: TEditQuestion, imageUrlBuffer?: Buffer, image?: Buffer) {
        const obj = new Question();
        const response = await obj.updateQuestion(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.explanation_image) {
                const oldPath = data.explanation_image.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/question/${id}-${dateId}`;

                imgRes = (await img.updateImage(
                    `images/question/${oldFileName}`,
                    image,
                    newFileName
                )) as string;
            } else {
                imgRes = await img.uploadImage(image, `images/question/${id}`);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateQuestionImage(id, { explanation_image: imageUrl });
        }

        if (imageUrlBuffer && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data.image_url) {
                const oldPath = data.image_url.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/question/${id}-${dateId}`;

                imgRes = (await img.updateImage(
                    `images/question/${oldFileName}`,
                    imageUrlBuffer,
                    newFileName
                )) as string;
            } else {
                imgRes = await img.uploadImage(imageUrlBuffer, `images/question/${id}`);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateQuestionImage(id, { image_url: imageUrl });
        }

        return response;
    }

    static async deleteQuestions(ids: string[]) {
        const obj = new Question();
        const response = await obj.deleteQuestions(ids);
        return response;
    }

    static async getCourseQuestions(courseId: string, data: TListFilters) {
        const obj = new Question();
        const response = await obj.getCourseQuestions(courseId, data);
        return response;
    }
}
