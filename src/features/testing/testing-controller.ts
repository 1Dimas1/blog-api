import {Request, Response} from 'express'
import {blogCollection, postCollection, userCollection} from "../../db/db";

import {HTTP_CODES} from "../../common/http.statuses";

export const testingController = {
    async clearDB(req: Request, res: Response) {
        await postCollection.drop();
        await blogCollection.drop();
        await userCollection.drop();
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}