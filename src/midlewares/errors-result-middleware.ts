import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import {HTTP_CODES} from "../settings";

export const errorResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({
            errorsMessages: errors
                .array({onlyFirstError: true})
                .map((err) => {
                    return {message: err.msg, field: (err as any).path}
                }),
        })
        return;
    } else {
        next()
    }
}