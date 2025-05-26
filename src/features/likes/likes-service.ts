import {inject, injectable} from "inversify";
import {LikeInputType, LikeType, LikeDocument} from "./like.type";
import {Result, ResultStatus} from "../../common/types/result.type";
import LikesRepository from "./likes-repository";
import CommentsQueryService from "../comments/comments-query-service";
import mongoose from "mongoose";
import {CommentViewType} from "../comments/comment.type";

@injectable()
export default class LikesService {
    constructor(
        @inject(LikesRepository)
        private likesRepository: LikesRepository,
        @inject(CommentsQueryService)
        private commentsQueryService: CommentsQueryService,
    ) {}

    async updateCommentLikeStatus(
        commentId: string,
        likeInputData: LikeInputType,
        userId: string
    ): Promise<Result> {

        const comment: CommentViewType | null = await this.commentsQueryService.getComment(commentId, userId);
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

        const existingLike: LikeDocument | null = await this.likesRepository.findLike(userId, commentId, 'comment');

        if (existingLike) {
            if (existingLike.status === likeInputData.likeStatus) {
                return {
                    status: ResultStatus.Success,
                    data: null,
                    extensions: []
                };
            }
            await this.likesRepository.updateLike(userId, commentId, 'comment', likeInputData.likeStatus);
        } else {
            const newLike: LikeType = {
                userId: new mongoose.Types.ObjectId(userId),
                parentId: new mongoose.Types.ObjectId(commentId),
                parentType: 'comment',
                status: likeInputData.likeStatus,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await this.likesRepository.createLike(newLike);
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }
}