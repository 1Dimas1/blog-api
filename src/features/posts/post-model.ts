import mongoose from "mongoose";
import {PostModelType, PostType} from "./post.type";
import {SETTINGS} from "../../settings";
import {postSchema} from "./post-schema";

export const PostModel: PostModelType = mongoose.model<PostType, PostModelType>(SETTINGS.POST_COLLECTION_NAME, postSchema);