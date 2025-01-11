import {CommentDBType, CommentPaginatedViewModel, CommentViewModel, QueryCommentType} from "./comment.type";
import {commentCollection} from "../../db/db";
import {ObjectId} from "mongodb";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment: CommentDBType | null = await commentCollection.findOne({ _id: new ObjectId(id) });
        if (!comment) return null;
        return this._mapToOutput(comment);
    },

    async getCommentsByPostId(
        postId: string,
        { pageNumber, pageSize, sortBy, sortDirection }: QueryCommentType
    ): Promise<CommentPaginatedViewModel> {
        const skip: number = (pageNumber - 1) * pageSize;

        const comments: CommentDBType[] = await commentCollection
                .find({ postId: new ObjectId(postId) })
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray()

        const totalCount: number = await commentCollection.countDocuments({ postId: new ObjectId(postId) })
        const pagesCount: number = Math.ceil(totalCount / pageSize);

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(comment => this._mapToOutput(comment))
        };
    },

    _mapToOutput(comment: CommentDBType): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        };
    },
}