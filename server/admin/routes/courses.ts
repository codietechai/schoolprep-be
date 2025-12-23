import * as express from "express";
import CourseController from "admin/controllers/courses/controller";
import { validateCourseBody, validateListCourseQuery } from "admin/controllers/courses/validation";
import { authorize } from "admin/middlewares";

const router = express.Router();

const {
  addCourse,
  getCourses,
  getCourse,
  editCourse,
  deleteCourse,
} = CourseController;

router.get("/list",authorize('course',"read"), validateListCourseQuery, getCourses);
router.get("/get/:id",authorize('course',"read"), getCourse);
router.post("/add",authorize('course',"create"), validateCourseBody, addCourse);
router.post("/edit/:id",authorize('course',"update"), validateCourseBody, editCourse);
router.delete("/delete",authorize('course',"delete"), deleteCourse);

export default router;
