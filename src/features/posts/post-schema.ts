import mongoose from "mongoose";
import {PostType} from "./post.type";
import {SETTINGS} from "../../settings";

export const postSchema = new mongoose.Schema<PostType>({
    title: {
        type: String,
        required: true,
        maxlength: 30,
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 100,
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SETTINGS.BLOG_COLLECTION_NAME,
        required: true,
    },
    blogName:  {
        type: String,
        required: true,
        maxLength: 15,
        trim: true
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
    },
})