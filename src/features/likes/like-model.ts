import {LikeModelType, LikeType} from "./like.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";
import {likeSchema} from "./like-schema";

export const LikeModel: LikeModelType = mongoose.model<LikeType, LikeModelType>(SETTINGS.LIKE_COLLECTION_NAME, likeSchema);