import { Request, Response, NextFunction } from "express";
import { get, isEmpty } from "lodash";
import CourseCategoryService from "./service";
import { sendResponse } from "admin/helpers";
import { RESPONSE_TYPE, SUCCESS_MESSAGE, ERROR_MESSAGE } from "admin/constants";
import { TAddCategory, TEditCategory } from "./types";

export default class CourseCategoryController {

    // Add a new course category
    static async addCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const name = get(req.body, "name", "");
            const description = get(req.body, "description", "");
            const active = get(req.body, "active", true);
            const image: string = req.body?.image_data;
            delete req.body?.image_data;

            const existingCategory = await CourseCategoryService.getCategoryByName(name);

            if (!isEmpty(existingCategory)) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.CATEGORY_EXISTS)
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

            const categoryData: TAddCategory = {
                name,
                description,
                active,
            };

            await CourseCategoryService.addCategory(categoryData, imageBuffer);

            return res.status(201).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CATEGORY_CREATED)
            );
        } catch (err) {
            console.error('Error adding category:', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Get list of course categories
    static async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const size = get(req.query, "size", 10);
            const skip = get(req.query, "skip", 1);
            const search = get(req.query, "search", "");
            const sorting = get(req.query, "sorting", "id DESC").split(" ");

            const categories = await CourseCategoryService.getCategories({
                offset: parseInt(skip),
                limit: parseInt(size),
                search,
                sorting: sorting,
            });

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CATEGORIES_FETCHED, categories)
            );
        } catch (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Get a specific course category by ID
    static async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req.params, "id", "");

            const category = await CourseCategoryService.getCategoryById(id);

            if (isEmpty(category)) {
                return res.status(404).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.CATEGORY_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CATEGORY_FETCHED, category)
            );
        } catch (err) {
            console.error('Error fetching category:', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Edit an existing course category
    static async editCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = get(req.params, "id", "");
            const name = get(req.body, "name", "");
            const description = get(req.body, "description", "");
            const active = get(req.body, "active", true);
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

            const categoryData: TEditCategory = {
                name,
                description,
                active,
                image: currentImage
            };

            const updatedCategory = await CourseCategoryService.editCategory(id, categoryData, imageBuffer);

            if (!updatedCategory) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.CATEGORY_NOT_FOUND)
                );
            }

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CATEGORY_UPDATED)
            );
        } catch (err) {
            console.error('Error editing category:', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Delete one or more course categories
    static async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const ids = get(req.body, "ids", []);

            if (isEmpty(ids)) {
                return res.status(400).send(
                    sendResponse(RESPONSE_TYPE.ERROR, ERROR_MESSAGE.INVALID_IDS)
                );
            }

            await CourseCategoryService.deleteCategories(ids);

            return res.status(200).send(
                sendResponse(RESPONSE_TYPE.SUCCESS, SUCCESS_MESSAGE.CATEGORIES_DELETED)
            );
        } catch (err) {
            console.error('Error deleting categories:', err);
            return res.status(500).send({
                message: ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
