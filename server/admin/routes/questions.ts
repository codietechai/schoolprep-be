import * as express from "express";
import QuestionController from "admin/controllers/questions/controller";
import {
    validateQuestionBody,
    validateListQuestionQuery,
    validateQuestionIdParams,
    validateDeleteQuestionBody,
} from "admin/controllers/questions/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
    addQuestion,
    getQuestions,
    getQuestion,
    editQuestion,
    deleteQuestion,
    getCourseQuestions,
} = QuestionController;

router.get(
    "/list",
    authorize("question", "read"),
    validateListQuestionQuery,
    getQuestions
);
router.get(
    "/get/:id",
    authorize("question", "read"),
    validateQuestionIdParams,
    getQuestion
);
router.post(
    "/add",
    authorize("question", "create"),
    validateQuestionBody,
    addQuestion
);
router.post(
    "/edit/:id",
    authorize("question", "update"),
    validateQuestionIdParams,
    validateQuestionBody,
    editQuestion
);
router.delete(
    "/delete",
    authorize("question", "delete"),
    validateDeleteQuestionBody,
    deleteQuestion
);
router.get(
    "/course-questions",
    authorize("question", "read"),
    getCourseQuestions
);

export default router;
