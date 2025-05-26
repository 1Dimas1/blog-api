import {Response} from 'express'
import {RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery} from "../../common/types/request.type";
import {
    CommentIdParams,
    CommentInputType,
    CommentPaginatedViewType,
    CommentViewType,
    QueryCommentType
} from "./comment.type";
import {paginationCommentQueries} from "../../common/helpers/pagination-values";
import {PostIdParams} from "../posts/post.type";
import {HTTP_CODES} from "../../common/http.statuses";
import CommentsService from "./comments-service";
import CommentsQueryService from "./comments-query-service";
import {Result, ResultStatus} from "../../common/types/result.type";
import {resultCodeToHttpException} from "../../common/helpers/result-code.mapper";
import {inject, injectable} from "inversify";
import {LikeInputType} from "../likes/like.type";
import LikesService from "../likes/likes-service";

@injectable()
export default class CommentsController {
    constructor(
        @inject(CommentsQueryService)
        private commentsQueryService: CommentsQueryService,
        @inject(CommentsService)
        private commentsService: CommentsService,
        @inject(LikesService)
        private likeService: LikesService
    ) {}

    async getCommentsByPost(req: RequestWithParamsAndQuery<PostIdParams, QueryCommentType>, res: Response) {
        try {
            const {postId, sortBy, sortDirection, pageNumber, pageSize} = paginationCommentQueries(req)
            const userId: string | null = req.userId;

            const comments: CommentPaginatedViewType | null = await this.commentsQueryService.getPostsComments(
                postId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                userId
            );

            if (!comments) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }

            res.status(HTTP_CODES.OK_200).json(comments);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async getComment(req: RequestWithParams<CommentIdParams>, res: Response) {
        try {
            const userId: string | null = req.userId;
            const comment: CommentViewType | null = await this.commentsQueryService.getComment(req.params.id, userId);
            if (!comment) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404);
                return;
            }

            res.status(HTTP_CODES.OK_200).json(comment);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async createComment(req: RequestWithParamsAndBody<PostIdParams, CommentInputType>, res: Response) {
        try {
            const result: Result<CommentViewType> = await this.commentsService.createComment(
                req.params.id,
                req.body,
                req.userId!,
            );

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.status(HTTP_CODES.CREATED_201).json(result.data);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async updateComment(req: RequestWithParamsAndBody<CommentIdParams, CommentInputType>, res: Response) {
        try {
            const result: Result = await this.commentsService.updateComment(
                req.params.id,
                req.body,
                req.userId!
            );

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async deleteComment(req: RequestWithParams<CommentIdParams>, res: Response) {
        try {
            const result: Result = await this.commentsService.deleteComment(
                req.params.id,
                req.userId!
            );

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async updateCommentLikeStatus(req: RequestWithParamsAndBody<CommentIdParams, LikeInputType>, res: Response){
        try {
            const result: Result = await this.likeService.updateCommentLikeStatus(
                req.params.id,
                req.body,
                req.userId!
            );

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }
}