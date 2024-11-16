import {Request, Response} from 'express'
import {db} from "../db/db";
import {HTTP_CODES} from "../settings";

export const testingController = {
    clearDB(req: Request, res: Response) {
        db.blogs = [];
        db.posts = [];
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}