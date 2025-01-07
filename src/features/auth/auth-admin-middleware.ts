import { NextFunction, Request, Response } from "express";
import {SETTINGS} from "../../settings";
import {HTTP_CODES} from "../../common/http.statuses";

export const authAdminMiddleware = (
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
    } else {
        res.sendStatus(HTTP_CODES.UNAUTHORIZED_401)
        return;
    }
}
