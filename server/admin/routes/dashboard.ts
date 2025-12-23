import * as express from "express";
import CourseController from "admin/controllers/courses/controller";
import {
    validateCourseBody,
    validateListCourseQuery,
} from "admin/controllers/courses/validation";
import { authorize } from "admin/middlewares";
import DashboardController from "admin/controllers/dashboard/controller";

const router = express.Router();

const { getStudentDashboard, getTeacherDashBoard, cordinatorDashboard } =
    DashboardController;

router.get("/student-dashboard", getStudentDashboard);
router.get(
    "/teacher-dashboard",
    authorize("question", "create"),
    getTeacherDashBoard
);
router.get(
    "/cordinator-dashboard",
    authorize("user", "update"),
    cordinatorDashboard
);

export default router;
