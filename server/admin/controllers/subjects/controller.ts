import { Request, Response, NextFunction } from "express";
import { get, isEmpty } from "lodash";
import SubjectService from "./service";  // Assuming the service layer handles DB operations
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";

// The controller to manage subjects
export default class SubjectController {

    // Add a new subject
    static async addSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const name = get(req?.body, "name", "");
            const description = get(req?.body, "description", "");
            const active = get(req?.body, "active", true);

            const newSubject = await SubjectService.addSubject({
                name,
                description,
                active
            });

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.SUBJECT_CREATED, newSubject)
            );
        } catch (err) {
            console.log("Error adding subject: ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
            });
        }
    }

    // Get a list of subjects
    static async getSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 0);
            const search = get(req?.query, "search", "");
            const sorting = get(req?.query, "sorting", "id DESC").split(" ");

            const subjects = await SubjectService.getSubjects({
                limit: parseInt(size),
                offset: parseInt(skip),
                search,
                sorting
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.SUBJECTS_FETCHED, subjects)
            );
        } catch (err) {
            console.log("Error fetching subjects: ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
            });
        }
    }

    // Get details of a specific subject by its ID
    static async getSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");

            const subject = await SubjectService.getSubjectById(id);
            if (isEmpty(subject)) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.SUBJECT_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.SUBJECT_FETCHED, subject)
            );
        } catch (err) {
            console.log("Error fetching subject: ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
            });
        }
    }

    // Edit an existing subject's details
    static async editSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const name = get(req?.body, "name", "");
            const description = get(req?.body, "description", "");
            const active = get(req?.body, "active", true);

            const subject = await SubjectService.getSubjectById(id);
            if (isEmpty(subject)) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.SUBJECT_NOT_FOUND)
                );
            }

            const updatedSubject = await SubjectService.updateSubject(id, {
                name,
                description,
                active
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.SUBJECT_UPDATED, updatedSubject)
            );
        } catch (err) {
            console.log("Error editing subject: ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
            });
        }
    }

    // Delete one or more subjects
    static async deleteSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req?.body, "ids", []);

            if (isEmpty(ids)) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.NO_SUBJECTS_TO_DELETE)
                );
            }

            await SubjectService.deleteSubjects(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.SUBJECTS_DELETED)
            );
        } catch (err) {
            console.log("Error deleting subject(s): ", err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR
            });
        }
    }
}
