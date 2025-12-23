import * as express from "express";
import TestController from "admin/controllers/Test/controller";
import {
    seeUserTestReportBody,
    validateActiveTestBody,
    validateCreateTestBody,
    validateFetchUserTestParams,
    validatehandleQuestionActionBodyBody,
    validateSubmitQuestionTestBody,
    ValidateSubmitUserTestBody,
} from "admin/controllers/Test/validation";
import { auth } from "admin/middlewares";

const router = express.Router();

const {
    createTest,
    getAllUserTest,
    getActiveUserTest,
    submitQuestion,
    submitTest,
    getTestReport,
    handlePerQuestionTime,
    getCountToCreatePreprartoryTest,
    addBookmarkQuestions,
    removeBookmarkQuestions,
    getAllTestBookmark,
    getDiagnosticTestCountAndTime,
    getOngoingTestId,
    viewCurrentUserTestPerformance,
} = TestController;

router.get("/get-ongoing-test-id/", getOngoingTestId);
router.post("/create-test/", validateCreateTestBody, createTest);
router.get("/get-all-user-test", validateFetchUserTestParams, getAllUserTest);
router.get("/get-active-user-test", validateActiveTestBody, getActiveUserTest);
router.post("/submit-test", auth, ValidateSubmitUserTestBody, submitTest);

router.post("/submit-question", validateSubmitQuestionTestBody, submitQuestion);
router.post(
    "/handle-user-test-action",
    validatehandleQuestionActionBodyBody,
    handlePerQuestionTime
);
router.get("/get-test-report/:id", seeUserTestReportBody, getTestReport);
router.get("/get-count-to-create-prep-test/", getCountToCreatePreprartoryTest);
router.post("/mark-question-bookmark/", auth, addBookmarkQuestions);
router.post("/unmark-question-from-bookmark/", auth, removeBookmarkQuestions);
router.get("/get-test-bookmark-questions/:id", auth, getAllTestBookmark);
router.get("/diagnostic-test-count/:id", auth, getDiagnosticTestCountAndTime);
router.get(
    "/view-current-user-test-performance/:id",
    auth,
    viewCurrentUserTestPerformance
);

getAllTestBookmark;
export default router;
