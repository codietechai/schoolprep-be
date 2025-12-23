import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";

export function validateNumberId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const idSchema = Joi.number().integer().positive().required();
  const validData = idSchema.validate(+id);

  if (validData.error) {
    return res.status(400).send({
      message: "Invalid id in request",
    });
  }

  next();
}
