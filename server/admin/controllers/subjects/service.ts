import { Subjects } from "admin/models/";  // Assuming the Subject model is in this location
import {
    TListFilters,
    TAddSubject,
    TEditSubject
} from "admin/controllers/subjects/types";  // Assuming types are located here

export default class SubjectService {
  
  // Fetch subjects based on filters like pagination, search etc.
  static async getSubjects(data: TListFilters) {
    const obj = new Subjects();  // Create an instance of the Subject model
    const response = await obj.getSubjects(data);  // Calls the database method for fetching subjects
    return response;
  }

  // Add a new subject
  static async addSubject(data: TAddSubject) {
    const obj = new Subjects();
    const response = await obj.addSubject(data);  // Calls the database method for adding a new subject
    return response;
  }

  // Edit an existing subject's details
  static async updateSubject(id: number, data: TEditSubject) {
    const obj = new Subjects();
    const response = await obj.updateSubject(id, data);  // Calls the database method for editing subject
    return response;
  }

  // Fetch subject by its ID
  static async getSubjectById(id: number) {
    const obj = new Subjects();
    const response = await obj.getSubjectById(id);  // Calls the database method to get subject by ID
    return response;
  }

  // Delete one or more subjects
  static async deleteSubjects(ids: number[]) {
    const obj = new Subjects();
    const response = await obj.deleteSubjects(ids);  // Calls the database method for deleting subjects
    return response;
  }
}
