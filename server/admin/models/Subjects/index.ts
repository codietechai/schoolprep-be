import { Subject as SubjectModel } from "server/database/schema";  // Ensure you have your Mongoose schema for Subject
import { TListFilters, TAddSubject, TEditSubject } from 'admin/controllers/subjects/types';  // Types for your subject operations

export class Subjects {

  // Fetch subjects based on filters (pagination, search, etc.)
  public async getSubjects(filters: TListFilters) {
    const where: any = {};

    // Search filter for name or code
    if (filters.search) {
      where.$or = [
        { name: { $regex: filters.search, $options: 'i' } },  // Case-insensitive search
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

    const total = await SubjectModel.countDocuments(where); // countDocuments for MongoDB
    const data = await SubjectModel.find(where)
      .skip(filters.offset)
      .limit(filters.limit)
      .sort(sortObj);

    return { total, data };
  }

  // Add a new subject
  public async addSubject(data: TAddSubject) {
    const newSubject = await SubjectModel.create(data); // Mongoose method to create a new document
    return newSubject;
  }

  // Edit an existing subject by its ID
  public async updateSubject(id: number, data: TEditSubject) {
    const subject = await SubjectModel.findById(id);
    if (!subject) return null;

    // Update the subject
    await subject.updateOne(data);  // Mongoose method to update
    return subject;
  }

  // Fetch subject by its ID
  public async getSubjectById(id: number) {
    const subject = await SubjectModel.findById(id);  // Mongoose method to find a document by ID
    return subject ? subject : null;
  }

  // Delete one or more subjects
  public async deleteSubjects(ids: number[]) {
    const response = await SubjectModel.deleteMany({
      _id: { $in: ids }  // MongoDB query to delete documents by IDs
    });
    return response.deletedCount;  // Returns number of rows deleted
  }
}
