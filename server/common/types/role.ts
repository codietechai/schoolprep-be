export interface TRole {
    name: string; // The name of the role (e.g., "Admin", "User")
    description: string; // A brief description of the role
    role_permissions: any; // An array of permission IDs (or permission objects depending on the implementation)
    active: boolean; // Whether the role is active or not
}
