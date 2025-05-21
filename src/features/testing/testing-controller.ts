import {Request, Response} from 'express'
import {HTTP_CODES} from "../../common/http.statuses";
import {BlogModel} from "../blogs/blog-model";
import {PostModel} from "../posts/post-model";
import {UserModel} from "../users/user-model";
import {CommentModel} from "../comments/comment-model";
import {SecurityDeviceModel} from "../security-devices/security-device-model";
import {InvalidRefreshTokenModel} from "../auth/invalid-refresh-token-model";
import {RateLimitModel} from "../../common/rate-limit/rate-limit-model";

export const testingController = {
    async clearDB(req: Request, res: Response) {
        await PostModel.collection.drop();
        await BlogModel.collection.drop();
        await UserModel.collection.drop();
        await CommentModel.collection.drop()
        await InvalidRefreshTokenModel.collection.drop()
        await SecurityDeviceModel.collection.drop()
        await RateLimitModel.collection.drop()
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}