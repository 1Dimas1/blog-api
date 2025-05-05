import {CommentDBType, CommentInputType, CommentType, CommentViewModel} from "./comment.type";
import PostsRepository from "../posts/posts-repository";
import {PostDBType} from "../posts/post.type";
import {InsertOneResult} from "mongodb";
import {UserDBType} from "../users/user.type";
import UsersRepository from "../users/users-repository";
import {Result, ResultStatus} from "../../common/types/result.type";
import CommentsQueryService from "./comments-query-service";
import CommentsRepository from "./comments-repository";
import {inject, injectable} from "inversify";

@injectable()
export default class CommentsService {
    constructor(
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(CommentsRepository)
        private commentsRepository: CommentsRepository,
        @inject(CommentsQueryService)
        private commentsQueryService: CommentsQueryService,
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
    ) {}

    async createComment(
        postId: string,
        commentInputData: CommentInputType,
        userId: string,
    ): Promise<Result<CommentViewModel>> {
        const post: PostDBType | null = await this.postsRepository.findPostById(postId);
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

        const user: UserDBType | null  = await this.usersRepository.findUserById(userId);
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

        const result: InsertOneResult<CommentDBType> = await this.commentsRepository.createComment(newComment);
        const createdComment: CommentViewModel | null = await this.commentsQueryService.getCommentById(result.insertedId.toString());

        return {
            status: ResultStatus.Success,
            data: createdComment!,
            extensions: []
        };
    }

    async updateComment(
        commentId: string,
        input: CommentInputType,
        userId: string
    ): Promise<Result> {
        const comment: CommentViewModel | null = await this.commentsQueryService.getCommentById(commentId);
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

        await this.commentsRepository.updateComment(commentId, input.content);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        }

    }

    async deleteComment(commentId: string, userId: string): Promise<Result> {
        const comment: CommentViewModel | null = await this.commentsQueryService.getCommentById(commentId);
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

        await this.commentsRepository.deleteComment(commentId);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        }
    }
}