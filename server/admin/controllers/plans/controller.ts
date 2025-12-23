import { Request, Response, NextFunction } from "express";
import PlanService from "./service";
import { TAddPlan, TEditPlan } from "./types";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { get } from "lodash";

export default class PlanController {
    static async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const size = req.query.size ? parseInt(req.query.size as string) : 10;
            const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
            const courseid = req.query.skip ? req.params.courseid as string : '';
            const search = req.query.search ? req.query.search as string : "";
            const sorting = get(req.query, "sorting", "id DESC").split(" ");

            const plans = await PlanService.getPlans(courseid, {
                offset: skip,
                limit: size,
                search,
                sorting
            });

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PLANS_FETCHED,
                    plans
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async addPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, price, description, active, duration, course }: TAddPlan = req.body;

            const newPlan = await PlanService.addPlan({
                name,
                price,
                description,
                active,
                duration,
                course
            });

            return res.status(201).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PLAN_ADDED,
                    { id: newPlan.id }
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async getPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const plan = await PlanService.getPlanById(id);

            if (!plan) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.PLAN_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PLAN_FETCHED,
                    plan
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async editPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, price, description, active, duration, course }: TEditPlan = req.body;

            const updatedPlan = await PlanService.editPlan(id, {
                name,
                price,
                description,
                active,
                duration,
                course
            });

            if (!updatedPlan) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.PLAN_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PLAN_UPDATED
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    static async deletePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const { ids }: { ids: string[] } = req.body;

            const deletedCount = await PlanService.deletePlans(ids);

            if (deletedCount === 0) {
                return res.status(404).send(
                    sendResponse(
                        RESPONSE_TYPE.ERROR,
                        ERROR_MESSAGE.PLAN_NOT_FOUND
                    )
                );
            }

            return res.status(200).send(
                sendResponse(
                    RESPONSE_TYPE.SUCCESS,
                    SUCCESS_MESSAGE.PLAN_DELETED
                )
            );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
