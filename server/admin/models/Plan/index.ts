import { Plan as PlanModel } from "server/database/schema";
import { TListFilters, TAddPlan, TEditPlan } from 'admin/controllers/plans/types';

export class Plan {
  constructor() { }

  public async getPlans(courseid: string, filters: TListFilters) {
    const where: any = {};

    where.course = courseid;

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

    const total = await PlanModel.countDocuments(where);
    const data = await PlanModel.find(where)
      .skip(filters.offset)
      .limit(filters.limit).sort(sortObj);

    return { total, data };
  }

  public async addPlan(data: TAddPlan): Promise<any> {
    const newPlan = await PlanModel.create(data);
    return newPlan;
  }

  public async getPlanByName(name: string): Promise<any> {
    const plan = await PlanModel.findOne({
      name,
    });
    return plan;
  }

  public async getPlanById(id: string): Promise<any> {
    const plan = await PlanModel.findById(id);
    return plan ? plan : null;
  }

  public async editPlan(id: string, data: TEditPlan): Promise<any> {
    const plan = await PlanModel.findById(id);
    if (!plan) return null;

    await plan.updateOne(data);
    return plan;
  }

  public async deletePlans(ids: string[]): Promise<number> {
    const response = await PlanModel.deleteMany({
      _id: { $in: ids },
    });
    return response.deletedCount;
  }

  public async updatePlanImage(id: string, image: string) {
    const plan = await PlanModel.findById(id);
    if (!plan) return null;

    await PlanModel.updateOne(
      { _id: id },
      { $set: { image: image } }
    );
    return plan;
  }
}
