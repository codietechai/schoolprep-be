import { Plan } from "admin/models";
import { TListFilters, TAddPlan, TEditPlan } from "./types";

export default class PlanService {
    static async getPlans(courseid: string, data: TListFilters) {
        const obj = new Plan();
        const response = await obj.getPlans(courseid, data);
        return response;
    }

    static async addPlan(data: TAddPlan) {
        const obj = new Plan();
        const response = await obj.addPlan(data);
        return response;
    }

    static async getPlanById(id: string) {
        const obj = new Plan();
        const response = await obj.getPlanById(id); 
        return response;
    }

    static async editPlan(id: string, data: TEditPlan) {
        const obj = new Plan();
        const response = await obj.editPlan(id, data);
        return response;
    }

    static async deletePlans(ids: string[]) {
        const obj = new Plan();
        const response = await obj.deletePlans(ids);
        return response;
    }
}
