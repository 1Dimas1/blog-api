import mongoose from "mongoose";
import {LikeStatus, LikeType} from "./like.type";
import {SETTINGS} from "../../settings";

export const likeSchema = new mongoose.Schema<LikeType>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: SETTINGS.USER_COLLECTION_NAME,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        parentType: {
            type: String,
            required: true,
            enum: ['comment', 'post'],
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(LikeStatus),
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
            immutable: true,
        },
        updatedAt: {
            type: Date,
            default: () => new Date(),
        },
    }
);

likeSchema.index({ userId: 1, parentId: 1, parentType: 1 }, { unique: true });