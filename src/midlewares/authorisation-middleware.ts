import { NextFunction, Request, Response } from "express";
import {HTTP_CODES, SETTINGS} from "../settings";

export const authorisationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
)=> {
    const credentials = `${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`
    const base64credentials = Buffer.from(credentials).toString('base64')
    const validAuthValue = `Basic ${base64credentials}`
    const authHeader = req.headers.authorization

    if (authHeader && authHeader === validAuthValue) {
        next()
    }

    res.sendStatus(HTTP_CODES.UNAUTHORIZED)
    return;
}