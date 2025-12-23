import { Request, Response, NextFunction } from "express";
import formatResponse from "./format-response";

const getMessageFromJoiError = (joiErrors) => {
    const allowedKeys = [""];
    const errors = joiErrors.filter((item) =>
        allowedKeys.includes(item.context.key)
    );
    if (errors.length === 1) {
        return errors[0].message;
    }
    return "Your request doesn't have valid parameters.";
};

const validationCheckHandler = (res, next, result) => {
    if (result.error) {
        res.status(400).send(
            formatResponse(
                getMessageFromJoiError(result.error.details),
                process.env.NODE_ENV === "production" ? {} : result.error,
                true
            )
        );
        return res.send();
    }
    return next();
};

export const validateReq = (
    req: Request,
    res: Response,
    next: NextFunction,
    schema,
    typeName: string
) => {
    let result;
    switch (typeName) {
        case "params":
            result = schema.validate(req.params);
            break;
        case "query":
            result = schema.validate(req.query);
            break;
        default:
            result = schema.validate(req.body);
            break;
    }
    validationCheckHandler(res, next, result);
};
