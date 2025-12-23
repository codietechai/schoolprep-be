import { Course as CourseModel } from 'database/schema'; // Ensure the path to your Course model is correct (Mongoose model)
import { TListFilters, TAddCourse, TEditCourse } from 'admin/controllers/courses/types'; // Import the correct types for course operations

export class Course {
  constructor() { }

  /**
   * Get the list of courses with filtering, sorting, and pagination
   * @param filters 
   * @returns 
   */
  public async getCourses(filters: TListFilters) {
    const where: any = {};

    // Search filter for name or code
    if (filters.search) {
      where.$or = [
        { name: { $regex: filters.search, $options: 'i' } }
      ];
    }

    let colName = filters?.sorting ? filters.sorting[0] : '';
    if (colName === 'id') {
      colName = '_id';
    }
    let sortObj = {};
    if (filters.sorting) {
      sortObj = { [colName]: filters.sorting[1] === 'ASC' ? 1 : -1 };
    }

    const total = await CourseModel.countDocuments(where); // countDocuments for MongoDB
    const data = await CourseModel.find(where)
      .skip(filters.offset)  // pagination: skip the first 'offset' documents
      .limit(filters.limit).sort(sortObj);  // pagination: limit the results to 'limit'

    return { total, data };
  }

  /**
   * Add a new course
   * @param data 
   * @returns 
   */
  public async addCourse(data: TAddCourse): Promise<any> {
    const newCourse = await CourseModel.create(data); // MongoDB create method
    return newCourse;
  }

  /**
   * Get a course by its unique name (to avoid duplication or check if exists)
   * @param name 
   * @returns 
   */
  public async getCourseByName(name: string): Promise<any> {
    const course = await CourseModel.findOne({
      name, // MongoDB findOne method to search by name
    });
    return course;
  }

  /**
   * Get a course by its ID
   * @param id 
   * @returns 
   */
  public async getCourseById(id: string): Promise<any> {
    const course = await CourseModel.findById(id); // MongoDB findById method
    return course ? course : null;
  }

  /**
   * Edit an existing course by its ID
   * @param id 
   * @param data 
   * @returns 
   */
  public async editCourse(id: string, data: TEditCourse): Promise<any> {
    const course = await CourseModel.findById(id); // MongoDB findById method
    if (!course) return null;

    // Update course using the updateOne method
    await course.updateOne(data); // MongoDB updateOne method
    return course;
  }

  /**
   * Delete courses by a list of course IDs
   * @param ids 
   * @returns 
   */
  public async deleteCourses(ids: string[]): Promise<number> {
    const response = await CourseModel.deleteMany({
      _id: { $in: ids }, // MongoDB way to find documents by multiple IDs
    });
    return response.deletedCount; // MongoDB returns deletedCount instead of number of rows
  }


  public async updateCourseImage(id: string, image: string) {
    const course = await CourseModel.findById(id); // MongoDB findById method
    if (!course) return null;

    await CourseModel.updateOne(
      { _id: id },
      { $set: { image: image } }
    );
    return course;
  }
}
