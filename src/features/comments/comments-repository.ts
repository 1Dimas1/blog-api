import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {CommentDocument, CommentType} from "./comment.type";
import {injectable} from "inversify";
import {CommentModel} from "./comment-model";

@injectable()
export default class CommentsRepository {

    async createComment(comment: CommentType): Promise<CommentDocument> {
        return CommentModel.insertOne(comment);
    }

    async updateComment(id: string, content: string): Promise<UpdateResult<CommentDocument>> {
        return CommentModel.updateOne(
            { _id: id },
            { content }
        );
    }

    async deleteComment(id: string): Promise<DeleteResult> {
        return CommentModel.deleteOne({ _id: new ObjectId(id) });
    }
}