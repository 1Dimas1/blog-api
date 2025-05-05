import {Response} from 'express'
import {RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery} from "../../common/types/request.type";
import {
    CommentIdParams,
    CommentInputType,
    CommentPaginatedViewModel,
    CommentViewModel,
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

@injectable()
export default class CommentsController {
    constructor(
        @inject(CommentsQueryService)
        private commentsQueryService: CommentsQueryService,
        @inject(CommentsService)
        private commentsService: CommentsService,
    ) {}

    async getCommentsByPost(req: RequestWithParamsAndQuery<PostIdParams, QueryCommentType>, res: Response) {
        try {
            const {postId, sortBy, sortDirection, pageNumber, pageSize} = paginationCommentQueries(req)

            const comments: CommentPaginatedViewModel | null = await this.commentsQueryService.getCommentsByPostId(
                postId,
                { pageNumber, pageSize, sortBy, sortDirection }
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
            const comment: CommentViewModel | null = await this.commentsQueryService.getCommentById(req.params.id);
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
            const result: Result<CommentViewModel> = await this.commentsService.createComment(
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
}