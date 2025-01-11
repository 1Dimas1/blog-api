import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {CommentType} from "./comment.type";
import {commentCollection} from "../../db/db";

export const commentsRepository = {

    async createComment(comment: CommentType): Promise<InsertOneResult<CommentType>> {
        return commentCollection.insertOne(comment);
    },

    async updateComment(id: string, content: string): Promise<UpdateResult<CommentType>> {
        return await commentCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { content } }
        );
    },

    async deleteComment(id: string): Promise<DeleteResult> {
        return await commentCollection.deleteOne({ _id: new ObjectId(id) });
    }
}