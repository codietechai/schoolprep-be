import { Course, ImageCrud } from "admin/models"; // Assuming you have a Course model similar to Admin
import { TListFilters, TAddCourse, TEditCourse } from "./types"; // Types for adding and editing courses

export default class CourseService {
    /**
     * Get a list of courses with filtering, pagination, and sorting
     * @param data - Object containing filter, pagination, and sorting parameters
     * @returns A list of courses
     */
    static async getCourses(data: TListFilters) {
        const obj = new Course();
        const response = await obj.getCourses(data); // Assume the model method handles the query
        return response;
    }

    /**
     * Add a new course
     * @param data - The course data to be added
     * @returns The created course
     */
    static async addCourse(data: TAddCourse, image?: Buffer) {
        const obj = new Course();
        const response = await obj.addCourse(data); // Assume the model method handles the insert

        if (image && response._id) {
            const imageID = response._id.toString();
            const img = new ImageCrud();
            const dateId = new Date().getTime();
            const fileName = `images/course/${imageID}-${dateId}`;
            const imgRes = await img.uploadImage(image, fileName);
            const imageUrl = (imgRes as string).split("?")[0];
            const update = await obj.updateCourseImage(imageID, imageUrl);
        }

        return response;
    }

    /**
     * Get a course by its ID
     * @param id - The ID of the course to be fetched
     * @returns The course if found, otherwise null
     */
    static async getCourseById(id: string) {
        const obj = new Course();
        const response = await obj.getCourseById(id); // Assume the model method fetches by ID
        return response;
    }

    /**
     * Edit an existing course
     * @param id - The ID of the course to be edited
     * @param data - The updated course data
     * @returns The updated course
     */
    static async editCourse(id: string, data: TEditCourse, image?: Buffer) {
        const obj = new Course();
        const response = await obj.editCourse(id, data); // Assume the model method handles the update

        if (image && id) {
            const img = new ImageCrud();
            let imgRes: string;
            if (data?.image) {
                const oldPath = data?.image?.split("/");
                const oldFileName = oldPath[oldPath.length - 1];
                const dateId = new Date().getTime();
                const newFileName = `images/course/${id}-${dateId}`;

                imgRes = (await img.updateImage(
                    `images/course/${oldFileName}`,
                    image,
                    newFileName
                )) as string;
            } else {
                imgRes = await img.uploadImage(image, `images/course/${id}`);
            }
            const imageUrl = (imgRes as string).split("?")[0];
            await obj.updateCourseImage(id, imageUrl);
        }

        return response;
    }

        static async getCourseByName(name: string) {
            const course = new Course();
            const response = await course.getCourseByName(name);
            return response;
        }

    /**
     * Delete one or more courses by their IDs
     * @param ids - The list of course IDs to be deleted
     * @returns The number of deleted courses
     */
    static async deleteCourses(ids: string[]) {
        const obj = new Course();
        const response = await obj.deleteCourses(ids); // Assume the model method handles the deletion
        return response;
    }
}
