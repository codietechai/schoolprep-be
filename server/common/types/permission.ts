// TPermission.ts
export type TPermission = {
    name: string;          // The name of the permission (e.g., "Create User")
    description?: string; // Optional description for the permission (e.g., "Permission to create a new user")
    active: boolean;      // Whether the permission is active or not
};
