import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";

export const validateRoleBody = (req: Request, res: Response, next: NextFunction) => {
    const roleSchema = Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Role name is required.",
            "string.empty": "Role name cannot be empty.",
        }),
        description: Joi.string().optional().allow("").messages({
            "string.base": "Description must be a string.",
        }),
        role_permissions: Joi.object()
            .pattern(
                Joi.string(), // Allow dynamic keys (like "User", "Dashboard", etc.)
                Joi.object({
                    create: Joi.boolean().required(),
                    read: Joi.boolean().required(),
                    update: Joi.boolean().required(),
                    delete: Joi.boolean().required(),
                }).required()
            )
            .required()
            .messages({
                "any.required": "Role permissions are required.",
                "object.base": "Role permissions must be a valid object.",
            }),
        active: Joi.boolean().optional().default(true),
    });

    // Perform validation
    const { error } = roleSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map((err) => err.message).join(", "),
        });
    }

    next();
};
