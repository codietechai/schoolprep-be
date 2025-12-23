import { Role as RoleModel } from "database/schema"; // Ensure you import the correct Mongoose model
import { TRole } from "common/types/role"; // Import the correct type for roles
import { ObjectId } from "mongoose"; // Import ObjectId from Mongoose
import { TListFilters } from 'admin/controllers/subjects/types';

export class Role {
    /**
     * Adds a new role to the system.
     * @param data - The role data to add.
     * @returns - The created role object.
     */
    public async addRole(data: TRole): Promise<TRole> {
        // Use Mongoose's create method to add the role
        const newRole = await RoleModel.create(data);
        return newRole;
    }

    /**
     * Fetches all roles in the system.
     * @returns - A list of all roles.
     */

    public async getAllRoles(filters: TListFilters): Promise<any> {
        const where: any = {};

        if (filters.search) {
            where.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
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

        const total = await RoleModel.countDocuments(where);
        const data = await RoleModel.find(where).skip(filters.offset)
            .limit(filters.limit)
            .sort(sortObj);

        return { total, data };
    }

    /**
     * Retrieves a single role by its ID.
     * @param id - The ID of the role to retrieve.
     * @returns - The role object or null if not found.
     */
    public async getRoleById(id: string | ObjectId): Promise<TRole | null> {
        // Use Mongoose's findById method to retrieve a role by its ID
        const role = await RoleModel.findById(id);
        return role ?? null; // Returns null if the role is not found
    }

    /**
     * Updates a specific role by its ID.
     * @param id - The ID of the role to update.
     * @param data - The new data to update the role with.
     * @returns - The updated role object or null if not found.
     */
    public async updateRole(id: string | ObjectId, data: TRole): Promise<TRole | null> {
        // Use Mongoose's findByIdAndUpdate method to update the role by its ID
        const updatedRole = await RoleModel.findByIdAndUpdate(id, data, { new: true });
        return updatedRole ?? null; // Returns null if the role is not found
    }

    /**
     * Deletes multiple roles based on their IDs.
     * @param ids - An array of role IDs to delete.
     * @returns - The number of deleted roles.
     */
    public async deleteRoles(ids: (string | ObjectId)[]): Promise<number> {
        // Use Mongoose's deleteMany method to delete roles by an array of IDs
        const result = await RoleModel.deleteMany({
            _id: { $in: ids },
        });
        return result.deletedCount ?? 0; // Returns the count of deleted documents or 0 if none were deleted
    }

    /**
     * Fetches a role by name.
     * Useful for checking if a role already exists (e.g., duplicates).
     * @param name - The name of the role to fetch.
     * @returns - The role object or null if not found.
     */
    public async getByName(name: string): Promise<TRole | null> {
        // Use Mongoose's findOne method to fetch the role by its name
        const role = await RoleModel.findOne({ name });
        return role ?? null; // Returns null if the role is not found
    }
}
