import { Schema, model, Document } from "mongoose";

// Define the structure of the role_permissions field
interface IActionPermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

interface IRole extends Document {
    name: string;
    description: string;
    role_permissions: {
        [key: string]: IActionPermissions; // Allows dynamic keys like "User" or "Role" with defined action permissions
    };
    active: boolean;
}

const roleSchema = new Schema<IRole>(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        role_permissions: {
            type: Map, // Use Map for dynamic keys
            of: new Schema({
                create: { type: Boolean, required: true, default: false },
                read: { type: Boolean, required: true, default: false },
                update: { type: Boolean, required: true, default: false },
                delete: { type: Boolean, required: true, default: false },
            }),
            required: true,
        },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Role = model<IRole>("Role", roleSchema);
