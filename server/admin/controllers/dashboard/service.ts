import { Dashboard } from "admin/models/Dashboard";


export default class DashboardService {

    static async studentDashboard(course_id: string,user_id:string) {
        const obj = new Dashboard();
        const response = await obj.studentDashboard(course_id,user_id);
        return response;
    }

    static async teacherDashboard() {
        const obj = new Dashboard();
        const response = await obj.teacherDashboard();
        return response;
    }

    static async cordinatorDashboard() {
        const obj = new Dashboard();
        const response = await obj.cordinatorDashboard();
        return response;
    }
}
