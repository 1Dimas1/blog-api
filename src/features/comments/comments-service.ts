import {CommentDBType, CommentInputType, CommentType, CommentViewModel} from "./comment.type";
import {postsRepository} from "../posts/posts-repository";
import {PostDBType} from "../posts/post.type";
import {InsertOneResult} from "mongodb";
import {UserDBType} from "../users/user.type";
import {usersRepository} from "../users/users-repository";
import {Result, ResultStatus} from "../../common/types/result.type";
import {commentsQueryService} from "./comments-queryService";
import {commentsRepository} from "./comments-repository";
import {commentsQueryRepository} from "./comments-queryRepository";

export const commentsService = {

    async createComment(
        postId: string,
        commentInputData: CommentInputType,
        userId: string,
    ): Promise<Result<CommentViewModel>> {
        const post: PostDBType | null = await postsRepository.findPostById(postId);
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{
                    field: 'postId',
                    message: 'Post not found'
                }],
                data: null
            };
        }

        const user: UserDBType | null  = await usersRepository.findUserById(userId);
        const userLogin: string = user!.login

        const newComment: CommentType = {
            content: commentInputData.content,
            commentatorInfo: {
                userId,
                userLogin
            },
            postId: post._id,
            createdAt: new Date().toISOString()
        };

        const result: InsertOneResult<CommentDBType> = await commentsRepository.createComment(newComment);
        const createdComment: CommentViewModel | null = await commentsQueryService.getCommentById(result.insertedId.toString());

        return {
            status: ResultStatus.Success,
            data: createdComment!,
            extensions: []
        };
    },

    async updateComment(
        commentId: string,
        input: CommentInputType,
        userId: string
    ): Promise<Result> {
        const comment: CommentViewModel | null = await commentsQueryRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{
                    field: 'commentId',
                    message: 'Comment not found'
                }],
                data: null
            };
        }

        if (comment.commentatorInfo.userId !== userId) {

            return {
                status: ResultStatus.Forbidden,
                extensions: [{
                    field: 'commentId',
                    message: 'You can only edit your own comments'
                }],
                data: null
            };
        }

        await commentsRepository.updateComment(commentId, input.content);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        }

    },

    async deleteComment(commentId: string, userId: string): Promise<Result> {
        const comment: CommentViewModel | null = await commentsQueryRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{
                    field: 'commentId',
                    message: 'Comment not found'
                }],
                data: null
            };
        }

        if (comment.commentatorInfo.userId !== userId) {

            return {
                status: ResultStatus.Forbidden,
                extensions: [{
                    field: 'commentId',
                    message: 'You can only edit your own comments'
                }],
                data: null
            };
        }

        await commentsRepository.deleteComment(commentId);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        }
    }
}