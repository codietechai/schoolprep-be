import { Permission } from "admin/models";
import { TPermission } from "common/types/permission";

export default class PermissionService {
    /**
     * Adds a new permission to the system.
     */
    static async addPermission(data: TPermission) {
        const obj = new Permission();
        const response = await obj.addPermission(data);
        return response;
    }

    /**
     * Fetches all permissions.
     */
    static async getAllPermissions() {
        const obj = new Permission();
        const response = await obj.getAllPermissions();
        return response;
    }

    /**
     * Retrieves a single permission by ID.
     */
    static async getPermissionById(id: string) {
        const obj = new Permission();
        const response = await obj.getPermissionById(id);
        return response;
    }

    /**
     * Updates a specific permission by ID.
     */
    static async updatePermission(id: string, data: TPermission) {
        const obj = new Permission();
        const response = await obj.updatePermission(id, data);
        return response;
    }

    /**
     * Deletes multiple permissions based on their IDs.
     */
    static async deletePermissions(ids: string[]) {
        const obj = new Permission();
        const response = await obj.deletePermissions(ids);
        return response;
    }

    /**
     * Fetches a permission by name.
     * Useful for checking duplicates.
     */
    static async getByName(name: string) {
        const obj = new Permission();
        const response = await obj.getByName(name);
        return response;
    }
}
