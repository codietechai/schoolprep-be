import { TestModal } from "admin/models/Test";
import {
    getUserTest,
    handlePerQuestionTimeType,
    submitQuestionType,
    submitTestType,
    TAddTest,
} from "./types";
import { Test } from "database/schema/Test";

export default class TestService {
    static async getOngoingTestId(user_id: string) {
        const obj = new TestModal();
        const response = await obj.getOngoingTestId(user_id);
        return response;
    }
    static async createTest(data: TAddTest) {
        const obj = new TestModal();
        const response = await obj.createTest(data);
        return response;
    }

    static async getUserTest(data: getUserTest) {
        const obj = new TestModal();
        const response = await obj.getUserTest(data);
        return response;
    }

    static async getCurrentActiveTest(
        _id: string,
        user_id: string,
        testType: string
    ) {
        const obj = new TestModal();
        const response = await obj.getCurrentActiveTest(_id, user_id, testType);
        return response;
    }

    static async getDiagnosticTestCountAndTime(course_id: string) {
        const obj = new TestModal();
        const response = await obj.getDiagnosticTestCountAndTime(course_id);
        return response;
    }

    static async submitQuestion(data: submitQuestionType) {
        const obj = new TestModal();
        const response = await obj.submitQuestion(data);
        return response;
    }

    static async submitTest(data: submitTestType) {
        const obj = new TestModal();
        const response = await obj.submitTest(data);
        return response;
    }

    static async handlePerQuestionTime(data: handlePerQuestionTimeType) {
        const obj = new TestModal();
        const response = await obj.handlePerQuestionTime(data);
        return response;
    }

    static async bookmarkQuestions(
        question_id: string,
        user_id: string,
        test_id: string
    ) {
        const obj = new TestModal();
        const response = await obj.bookmarkQuestions(
            question_id,
            user_id,
            test_id
        );
        return response;
    }

    static async removeBookmarkQuestions(
        question_id: string,
        user_id: string,
        test_id: string
    ) {
        const obj = new TestModal();
        const response = await obj.removeBookmarkQuestions(
            question_id,
            user_id,
            test_id
        );
        return response;
    }

    static async getAllBookmark(test_id: string, user_id: string) {
        const obj = new TestModal();
        const response = await obj.getAllBookmark(test_id, user_id);
        return response;
    }

    static async getTestReport(test_id: string) {
        const obj = new TestModal();
        const response = await obj.getTestReport(test_id);
        return response;
    }

    static async viewCurrentUserTestPerformance(course_id:string,user_id:string) {
        const obj = new TestModal();
        const response = await obj.viewCurrentUserTestPerformance(course_id,user_id);
        return response;
    }
}
