import { Request, Response, NextFunction } from "express";
import CourseService from "./service";
import { TAddCourse, TEditCourse } from "./types";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { get, isEmpty } from "lodash";
import DashboardService from "./service";
import { Role } from "database/schema";

/**
 * Course Controller
 * Handles the logic for managing courses (CRUD operations).
 */
export default class DashboardController {
    /**
     * Get a list of courses with filtering, pagination, and sorting
     * @param req
     * @param res
     * @param next
     * @returns
     */
    static async getStudentDashboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_id = (req as any).user.id;
            const course_id = get(req.query, "course_id", "");

            const studentDashbaord = await DashboardService.studentDashboard(
                course_id,
                user_id
            );

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.STUDENT_DASHBOARD,
                        studentDashbaord
                    )
                );
        } catch (err) {
            console.error("Error fetching Student Dashboard:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getTeacherDashBoard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_role = (req as any).user.role;

            const isTeacherRole = await Role.findById(user_role);
            // if (isTeacherRole.name === "Teacher") {
            const teacherDashbaord = await DashboardService.teacherDashboard();

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.TEACHER_DASHBOARD,
                        teacherDashbaord
                    )
                );
            // } else {
            //     res.status(400).send({
            //         message: "unauthorized access",
            //     });
            // }
        } catch (err) {
            console.error("Error fetching Student Dashboard:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async cordinatorDashboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user_role = (req as any).user.role;
            const teacherDashbaord =
                await DashboardService.cordinatorDashboard();

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.CORDINATOR_DASHBOARD,
                        teacherDashbaord
                    )
                );
        } catch (err) {
            console.error("Error fetching Student Dashboard:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
