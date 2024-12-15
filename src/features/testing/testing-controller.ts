import {Request, Response} from 'express'
import {blogCollection, postCollection} from "../../db/db";
import {HTTP_CODES} from "../../settings";

export const testingController = {
    async clearDB(req: Request, res: Response) {
        await postCollection.drop();
        await blogCollection.drop();
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}