import {
    CommentDocument,
    CommentPaginatedViewType,
    CommentViewType,
    QueryCommentType
} from "./comment.type";
import {injectable} from "inversify";
import {CommentModel} from "./comment-model";
import mongoose from "mongoose";

@injectable()
export default class CommentsQueryRepository {

    async getCommentById(id: string): Promise<CommentViewType | null> {
        const comment: CommentDocument | null = await CommentModel.findById(id).exec();
        if (!comment) return null;
        return this._mapToOutput(comment);
    }

    async getCommentsByPostId(
        postId: string,
        { pageNumber, pageSize, sortBy, sortDirection }: QueryCommentType
    ): Promise<CommentPaginatedViewType> {
        const skip: number = (pageNumber - 1) * pageSize;

        const comments: CommentDocument[] = await CommentModel
                .find({ postId: new mongoose.Types.ObjectId(postId) })
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .exec()


        const totalCount: number = await CommentModel.countDocuments({ postId: new mongoose.Types.ObjectId(postId) })
        const pagesCount: number = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(comment => this._mapToOutput(comment))
        };
    }

    _mapToOutput(comment: CommentDocument): CommentViewType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId.toString(),
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        };
    }
}