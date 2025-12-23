import { Request, Response, NextFunction } from "express";
import CourseService from "./service";
import { TAddCourse, TEditCourse } from "./types";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { get, isEmpty } from "lodash";

/**
 * Course Controller
 * Handles the logic for managing courses (CRUD operations).
 */
export default class CourseController {
    /**
     * Get a list of courses with filtering, pagination, and sorting
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    static async getCourses(req: Request, res: Response, next: NextFunction) {
        try {
            const size = req.query.size ? parseInt(req.query.size as string) : 10;
            const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
            const search = req.query.search ? req.query.search as string : "";
            const sorting = get(req.query, "sorting", "id DESC").split(" ");

            const courses = await CourseService.getCourses({
                offset: skip,
                limit: size,
                search,
                sorting
            });

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.COURSES_FETCHED,
                    courses
                )
            );
        } catch (err) {
            console.error("Error fetching courses:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Add a new course
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    static async addCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, category, description, active, subjects, level }: TAddCourse = req.body;
            const image: string = req.body?.image_data;
            delete req.body?.image_data;
            
            const existingRole = await CourseService.getCourseByName(name);

            if (existingRole) {

                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.COURSE_EXISTS)
                );
            }


            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }

            // use imageBuffer
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const newCourse = await CourseService.addCourse({
                name,
                category,
                description,
                subjects,
                active,
                level
            }, imageBuffer);

            return res.status(201).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.COURSE_ADDED,
                    { id: newCourse.id }
                )
            );
        } catch (err) {
            console.error("Error adding course:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Get a course by its ID
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    static async getCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const course = await CourseService.getCourseById(id);

            if (!course) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.COURSE_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.COURSE_FETCHED,
                    course
                )
            );
        } catch (err) {
            console.error("Error fetching course:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Edit an existing course by ID
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    static async editCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, category, description, active, subjects, level }: TEditCourse = req.body;
            const currentImage = get(req.body, "image", '');
            const image = req.body.image_data;
            delete req.body.image_data;

            let imageBuffer: Buffer | undefined;
            if (image) {
                const parts = image?.split(";base64,");
                const base64Image = parts?.pop();
                imageBuffer = Buffer.from(base64Image!, "base64");
            }
            if (image && !imageBuffer) {
                return res.status(400).send({
                    message: ERROR_MESSAGE.INVALID_IMAGE_DATA,
                });
            }

            const updatedCourse = await CourseService.editCourse(id, {
                name,
                category,
                description,
                active,
                subjects,
                image: currentImage,
                level
            }, imageBuffer);

            if (!updatedCourse) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.COURSE_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.COURSE_UPDATED
                )
            );
        } catch (err) {
            console.error("Error updating course:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Delete one or more courses by IDs
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    static async deleteCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids }: { ids: string[] } = req.body;

            const deletedCount = await CourseService.deleteCourses(ids);

            if (deletedCount === 0) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.COURSE_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.COURSE_DELETED
                )
            );
        } catch (err) {
            console.error("Error deleting course:", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
