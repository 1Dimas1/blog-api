import {CommentatorInfoType, CommentType} from "./comment.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";

const commentatorSchema = new mongoose.Schema<CommentatorInfoType>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: SETTINGS.USER_COLLECTION_NAME,
        },
        userLogin: {
            type: String,
            required: true,
        },
    },
    { _id: false },
)

export const commentSchema = new mongoose.Schema<CommentType>(
    {
        content: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 300,
        },
        commentatorInfo: {
            type: commentatorSchema,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: SETTINGS.POST_COLLECTION_NAME
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
            immutable: true,
        },
    }
)