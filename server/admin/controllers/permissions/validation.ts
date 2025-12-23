import Joi from "@hapi/joi";
import { NextFunction, Request, Response } from "express";

/**
 * Schema to validate request body for adding/editing permissions
 */
const permissionSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Permission name is required",
        "string.base": "Permission name must be a string",
    }),
    description: Joi.string().optional().allow("").messages({
        "string.base": "Description must be a string",
    }),
    active: Joi.boolean().required().messages({
        "any.required": "Active status is required",
        "boolean.base": "Active status must be a boolean value",
    }),
});

/**
 * Validation middleware for adding/editing permissions
 */
export function validatePermissionBody(req: Request, res: Response, next: NextFunction) {
    const { error } = permissionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).send({
            message: "Validation errors",
            errors: errorMessages,
        });
    }
    next();
}

/**
 * Schema to validate request for deleting permissions
 */
const deletePermissionSchema = Joi.object({
    ids: Joi.array().items(Joi.string().required()).min(1).required().messages({
        "array.base": "IDs must be an array of strings",
        "array.min": "At least one permission ID is required",
        "any.required": "Permission IDs are required",
        "string.base": "Each permission ID must be a string",
    }),
});

/**
 * Validation middleware for deleting permissions
 */
export function validateDeletePermissions(req: Request, res: Response, next: NextFunction) {
    const { error } = deletePermissionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).send({
            message: "Validation errors",
            errors: errorMessages,
        });
    }
    next();
}
