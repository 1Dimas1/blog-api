import {CommentModelType, CommentType} from "./comment.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";
import {commentSchema} from "./comment-schema";

export const CommentModel: CommentModelType = mongoose.model<CommentType, CommentModelType>(SETTINGS.COMMENT_COLLECTION_NAME, commentSchema);