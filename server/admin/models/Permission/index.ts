import { Permission as PermissionModel } from "server/database/schema"; // Ensure you import the correct Mongoose model
import { TPermission } from "common/types/permission"; // Import the correct type for permissions

export class Permission {
    /**
     * Adds a new permission to the system.
     * @param data - The permission data to add.
     * @returns - The created permission object.
     */
    public async addPermission(data: TPermission): Promise<TPermission | any> {
        // Use Mongoose's create method to add the permission
        const newPermission = await PermissionModel.create(data);
        return newPermission;
    }

    /**
     * Fetches all permissions in the system.
     * @returns - A list of all permissions.
     */

    public async getAllPermissions(): Promise<any> {
        
        const total = await PermissionModel.countDocuments();
        const data = await PermissionModel.find();

        return { total, data };
    }

    /**
     * Retrieves a single permission by its ID.
     * @param id - The ID of the permission to retrieve.
     * @returns - The permission object or null if not found.
     */
    public async getPermissionById(id: string): Promise<TPermission | null> {
        // Use Mongoose's findById method to retrieve a permission by its ID
        const permission = await PermissionModel.findById(id);
        return permission ?? null; // Returns null if the permission is not found
    }

    /**
     * Updates a specific permission by its ID.
     * @param id - The ID of the permission to update.
     * @param data - The new data to update the permission with.
     * @returns - The updated permission object or null if not found.
     */
    public async updatePermission(id: string, data: TPermission): Promise<TPermission | any> {
        // Use Mongoose's findByIdAndUpdate method to update the permission by its ID
        const updatedPermission = await PermissionModel.findByIdAndUpdate(id, data, { new: true }); // 'new: true' returns the updated document
        return updatedPermission ?? null; // Returns null if the permission is not found
    }

    /**
     * Deletes multiple permissions based on their IDs.
     * @param ids - An array of permission IDs to delete.
     * @returns - The number of deleted permissions.
     */
    public async deletePermissions(ids: string[]): Promise<number> {
        // Use Mongoose's deleteMany method to delete permissions by an array of IDs
        const result = await PermissionModel.deleteMany({
            _id: { $in: ids }, // MongoDB syntax to match any of the IDs in the array
        });
        return result.deletedCount; // Returns the count of deleted documents
    }

    /**
     * Fetches a permission by name.
     * Useful for checking if a permission already exists (e.g., duplicates).
     * @param name - The name of the permission to fetch.
     * @returns - The permission object or null if not found.
     */
    public async getByName(name: string): Promise<TPermission | null> {
        // Use Mongoose's findOne method to fetch the permission by its name
        const permission = await PermissionModel.findOne({ name });
        return permission ?? null; // Returns null if the permission is not found
    }
}
