import { Topics } from "admin/models/";
import {
    TListFilters,
    TAddTopic,
    TEditTopic,
    TAddTopicAllowedCount
} from "admin/controllers/topic/types";

export default class TopicService {
  
  static async getTopics(subject: string) {
    const obj = new Topics();
    const response = await obj.getTopics(subject);
    return response;
  }

  static async addTopic(data: TAddTopic) {
    const obj = new Topics();
    const response = await obj.addTopic(data);
    return response;
  }

  static async updateTopic(id: number, data: TEditTopic) {
    const obj = new Topics();
    const response = await obj.updateTopic(id, data);
    return response;
  }

  static async getTopicById(id: number) {
    const obj = new Topics();
    const response = await obj.getTopicById(id);
    return response;
  }

  static async deleteTopics(id: string) {
    const obj = new Topics();
    const response = await obj.deleteTopics(id);
    return response;
  }

  static async getCourseTopics(course: string) {
    const obj = new Topics();
    const response = await obj.getCourseTopics(course);
    return response;
  }

    static async addTopicAllowedQuestionsCount(data: TAddTopicAllowedCount) {
      const obj = new Topics();
      const response = await obj.addTopicAllowedQuestionsCount(data);
      return response;
    }
}

