import mongoose, {HydratedDocument, Model} from "mongoose";

export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export type LikeInputType = {
    likeStatus: LikeStatus;
};

export type LikeType = {
    userId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId;
    parentType: 'comment' | 'post';
    status: LikeStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type LikesInfoType = {
    likesCount: number;
    dislikesCount: number;
};

export type LikesInfoViewType = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
};

export type LikeDocument = HydratedDocument<LikeType>;

export type LikeModelType = Model<LikeType, {}, {}, {}, LikeDocument>;