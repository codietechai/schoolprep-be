import { CourseCategory as CourseCategoryModel } from "server/database/schema"; // Path to your CourseCategory model (ensure it's a Mongoose model)
import { TListFilters, TAddCategory, TEditCategory } from 'admin/controllers/course-categories/types'; // Import your types for category operations

export class CourseCategory {

  // Fetch subjects based on filters (pagination, search, etc.)
  public async getCategories(filters: TListFilters) {
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

    const total = await CourseCategoryModel.countDocuments(where); // countDocuments for MongoDB
    const data = await CourseCategoryModel.find(where)
      .skip(filters.offset)
      .limit(filters.limit).sort(sortObj);

    return { total, data };
  }

  // Add a new category
  public async addCategory(data: TAddCategory) {
    const newCategory = await CourseCategoryModel.create(data); // MongoDB create method
    return newCategory;
  }

  // Edit an existing category by its ID
  public async editCategory(id: string, data: TEditCategory) {
    const category = await CourseCategoryModel.findById(id); // MongoDB findById method
    if (!category) return null;

    // Update category
    await category.updateOne(data); // MongoDB updateOne method
    return category;
  }

  public async updateCategoryImage(id: string, image: string) {
    const category = await CourseCategoryModel.findById(id); // MongoDB findById method
    if (!category) return null;

    await CourseCategoryModel.updateOne(
      { _id: id },
      { $set: { image: image } }
    );
    return category;
  }

  // Fetch category by its ID
  public async getCategoryById(id: string) {
    const category = await CourseCategoryModel.findById(id); // MongoDB method to find by ID
    return category ? category : null;
  }

  // Fetch category by its name (for validation or checking duplicates)
  public async getCategoryByName(name: string) {
    const category = await CourseCategoryModel.findOne({
      name,
    }); // MongoDB method to find a single document by field
    return category;
  }

  // Delete one or more categories
  public async deleteCategories(ids: string[]) {
    const response = await CourseCategoryModel.deleteMany({
      _id: { $in: ids }, // MongoDB way to find documents by multiple IDs
    });
    return response.deletedCount; // MongoDB returns deletedCount instead of number of rows
  }
}
