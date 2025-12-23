import * as express from "express";
import SubjectController from "admin/controllers/subjects/controller";
import { validateSubjectBody, validateListSubjectQuery } from "admin/controllers/subjects/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
  addSubject,
  getSubjects,
  getSubject,
  editSubject,
  deleteSubject
} = SubjectController;

router.post("/add",authorize('subject',"create"), validateSubjectBody, addSubject);
router.get("/list",authorize('subject',"read"), validateListSubjectQuery, getSubjects);
router.get("/get/:id",authorize('subject',"read") ,getSubject);
router.post("/edit/:id",authorize('subject',"update"), validateSubjectBody, editSubject);
router.delete("/delete",authorize('subject',"delete"), deleteSubject);

export default router;
