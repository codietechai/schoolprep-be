import { CourseCategory, ImageCrud } from "admin/models"; // Import the CourseCategory model
import { TListFilters, TAddCategory, TEditCategory } from "./types"; // Import the type definitions

export default class CourseCategoryService {
    // Add a new category
    static async addCategory(data: TAddCategory, image?: Buffer) {
        const category = new CourseCategory();
        let response = await category.addCategory(data);
        if (image && response._id) {
            const imageID = response._id.toString();
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `images/categories/${imageID}-${dateId}`;
            const imgRes = await img.uploadImage(image, fileName);
            const imageUrl = (imgRes as string).split("?")[0];
            const update = await category.updateCategoryImage(imageID, imageUrl);
            response = update;
        }
        return response;
    }

    // Get a list of categories with filters
    static async getCategories(filters: TListFilters) {
        const category = new CourseCategory();
        const response = await category.getCategories(filters);
        return response;
    }

    // Get a category by its ID
    static async getCategoryById(id: string) {
        const category = new CourseCategory();
        const response = await category.getCategoryById(id);
        return response;
    }

    // Get a category by its name to check for existing category
    static async getCategoryByName(name: string) {
        const category = new CourseCategory();
        const response = await category.getCategoryByName(name);
        return response;
    }

    // Edit an existing category
    static async editCategory(id: string, data: TEditCategory, image?: Buffer) {
        const category = new CourseCategory();
        const response = await category.editCategory(id, data);

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data?.image) {
                const oldPath = data?.image?.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/categories/${id}-${dateId}`;

                imgRes = (await img.updateImage(
                    `images/categories/${oldFileName}`,
                    image,
                    newFileName
                )) as string;
            } else {
                imgRes = await img.uploadImage(image, `images/categories/${id}`);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await category.updateCategoryImage(id, imageUrl);
        }

        return response;
    }

    // Delete one or more categories
    static async deleteCategories(ids: string[]) {
        const category = new CourseCategory();
        const response = await category.deleteCategories(ids);
        return response;
    }
}
