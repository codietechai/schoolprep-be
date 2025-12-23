import { Role } from "admin/models"; // Assuming Role model is imported
import { TRole } from "common/types/role"; // Assuming TRole is the TypeScript type for role data

export default class RoleService {
    /**
     * Adds a new role to the system.
     */
    static async addRole(data: TRole) {
        const role = new Role();
        const response = await role.addRole(data);
        return response;
    }

    /**
     * Fetches all roles from the system.
     */
    static async getAllRoles(data: any) {
        const role = new Role();
        const response = await role.getAllRoles(data);
        return response;
    }

    /**
     * Retrieves a specific role by its ID.
     */
    static async getRoleById(id: string) {
        const role = new Role();
        const response = await role.getRoleById(id);
        return response;
    }

    /**
     * Updates an existing role.
     */
    static async updateRole(id: string, data: TRole) {
        const role = new Role();
        const response = await role.updateRole(id, data);
        return response;
    }

    /**
     * Deletes multiple roles based on their IDs.
     */
    static async deleteRoles(ids: string[]) {
        const role = new Role();
        const response = await role.deleteRoles(ids);
        return response;
    }

    /**
     * Fetches a role by its name to check for duplicates.
     */
    static async getByName(name: string) {
        const role = new Role();
        const response = await role.getByName(name);
        return response;
    }
}
