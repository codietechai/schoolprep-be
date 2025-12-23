import { NextFunction, Request, Response } from "express";
import { get, isEmpty } from "lodash";
import CouponService from "./service"; // Make sure the service file path is correct
import { sendResponse } from "admin/helpers"; // Assuming you have a sendResponse helper function
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants"; // Ensure constants are set up properly

export default class CouponController {

    /**
     * Get the list of coupons
     * @param req 
     * @param res 
     * @param next 
     */
    static async getCoupons(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req?.query, "size", 10);
            const skip = get(req?.query, "skip", 1);
            const search = get(req?.query, "search", "");
            const sorting = get(req?.query, "sorting", "id DESC").split(" ");

            const coupons = await CouponService.getCoupons({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.COUPON_FETCHED, coupons)
            );

        } catch (err) {
            console.log('>>>>> err', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Add a new coupon
     * @param req 
     * @param res 
     * @param next 
     */
    static async addCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const code = get(req?.body, "code", "");
            const discount_percentage = get(req?.body, "discount_percentage", 0);
            const valid_from = get(req?.body, "valid_from", "");
            const valid_until = get(req?.body, "valid_until", "");
            const active = get(req?.body, "active", true);

            const existingCoupon = await CouponService.getCouponByCode(code);

            if (!isEmpty(existingCoupon)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.COUPON_EXISTS
                        )
                    );
            }

            const newCoupon = await CouponService.addCoupon({
                code,
                discount_percentage,
                valid_from,
                valid_until,
                active
            });

            return res
                .status(201)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.COUPON_CREATED,
                        newCoupon
                    )
                );
        } catch (err) {
            console.log('>>>>> err', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Get a coupon by ID
     * @param req 
     * @param res 
     * @param next 
     */
    static async getCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");

            const coupon = await CouponService.getCouponById(id);

            if (isEmpty(coupon)) {
                return res
                    .status(400)
                    .send(
                        sendResponse(
                            RESPONSE_TYPE.ERROR,
                            ERROR_MESSAGE.COUPON_NOT_EXISTS
                        )
                    );
            }

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        coupon
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Edit an existing coupon
     * @param req 
     * @param res 
     * @param next 
     */
    static async editCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req?.params, "id", "");
            const code = get(req?.body, "code", "");
            const discount_percentage = get(req?.body, "discount_percentage", 0);
            const valid_from = get(req?.body, "valid_from", "");
            const valid_until = get(req?.body, "valid_until", "");
            const active = get(req?.body, "active", true);

            let payload = {
                code,
                discount_percentage,
                valid_from,
                valid_until,
                active
            };

            await CouponService.editCoupon(id, payload);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.COUPON_UPDATED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Delete coupons by IDs
     * @param req 
     * @param res 
     * @param next 
     */
    static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req?.body, "ids", []);

            if (!Array.isArray(ids) || !ids.length) {
                return res.status(400).send({
                    message: "Invalid coupon Ids",
                });
            }

            await CouponService.deleteCoupons(ids);

            return res
                .status(200)
                .send(
                    sendResponse(
                        RESPONSE_TYPE.SUCCESS,
                        SUCCESS_MESSAGE.COUPONS_DELETED
                    )
                );
        } catch (err) {
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
