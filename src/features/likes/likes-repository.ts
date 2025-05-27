import {injectable} from "inversify";
import {LikeDocument, LikesInfoType, LikeStatus, LikeType} from "./like.type";
import {LikeModel} from "./like-model";
import mongoose, {UpdateWriteOpResult} from "mongoose";

@injectable()
export default class LikesRepository {

    async findLike(userId: string, parentId: string, parentType: 'comment' | 'post'): Promise<LikeDocument | null> {
        return LikeModel.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            parentId: new mongoose.Types.ObjectId(parentId),
            parentType
        }).exec();
    }

    async createLike(likeData: LikeType): Promise<LikeDocument> {
        return LikeModel.create(likeData);
    }

    async updateLike(userId: string, parentId: string, parentType: 'comment' | 'post', status: LikeStatus): Promise<UpdateWriteOpResult> {
        return LikeModel.updateOne(
            {
                userId: new mongoose.Types.ObjectId(userId),
                parentId: new mongoose.Types.ObjectId(parentId),
                parentType
            },
            {
                status,
                updatedAt: new Date()
            }
        ).exec();
    }
}