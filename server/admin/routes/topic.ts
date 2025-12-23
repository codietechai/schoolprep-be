import * as express from "express";
import TopicController from "admin/controllers/topic/controller";
import {
    validateAddTopicAllowedCountBody,
    validateTopicBody,
} from "admin/controllers/topic/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
    addTopic,
    getTopics,
    getTopic,
    editTopic,
    deleteTopic,
    getCourseTopics,
    addTopicAllowedQuestionsCount
} = TopicController;

router.post("/add",authorize('subject',"create"), validateTopicBody, addTopic);
router.get("/list/:subject",authorize('subject',"read"), getTopics);
router.get("/get/:id",authorize('subject',"read"), getTopic);
router.post("/edit/:id",authorize('subject',"update"), validateTopicBody, editTopic);
router.delete("/delete/:id",authorize('subject',"delete"), deleteTopic);

router.get("/all/:course",authorize('subject',"read"), getCourseTopics);
router.post(
    "/add-topic-allowed-question-count",
    // authorize("topic", "create"),
    validateAddTopicAllowedCountBody,
    addTopicAllowedQuestionsCount
);


export default router;
