import {CommentDocument, CommentInputType, CommentType, CommentViewType} from "./comment.type";
import PostsRepository from "../posts/posts-repository";
import {PostDocument} from "../posts/post.type";
import {UserDocument} from "../users/user.type";
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
    ): Promise<Result<CommentViewType>> {
        const post: PostDocument | null = await this.postsRepository.findPostById(postId);
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

        const user: UserDocument | null  = await this.usersRepository.findUserById(userId);

        const newComment: CommentType = {
            content: commentInputData.content,
            commentatorInfo: {
                userId: user!._id,
                userLogin: user!.login
            },
            postId: post._id,
            createdAt: new Date()
        };

        const result: CommentDocument = await this.commentsRepository.createComment(newComment);
        const createdComment: CommentViewType | null = await this.commentsQueryService.getCommentById(result.id);

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
        const comment: CommentViewType | null = await this.commentsQueryService.getCommentById(commentId);
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
        const comment: CommentViewType | null = await this.commentsQueryService.getCommentById(commentId);
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