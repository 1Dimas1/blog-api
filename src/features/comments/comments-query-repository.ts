import {
    CommentAggregatedType,
    CommentPaginatedViewType,
    CommentViewType,
} from "./comment.type";
import {injectable} from "inversify";
import {CommentModel} from "./comment-model";
import mongoose, {PipelineStage} from "mongoose";
import { LikeStatus } from "../likes/like.type";
import { SETTINGS } from "../../settings";
import {SortDirection} from "mongodb";

@injectable()
export default class CommentsQueryRepository {

    async getComment(id: string, userId: string | null): Promise<CommentViewType | null> {
        const pipeline: PipelineStage[] = [
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: SETTINGS.LIKE_COLLECTION_NAME,
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$parentId', '$commentId'] },
                                        { $eq: ['$parentType', 'comment'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesInfo: {
                        likesCount: {
                            $size: {
                                $filter: {
                                    input: '$likes',
                                    cond: { $eq: ['$this.status', LikeStatus.Like] }
                                }
                            }
                        },
                        dislikesCount: {
                            $size: {
                                $filter: {
                                    input: '$likes',
                                    cond: { $eq: ['$this.status', LikeStatus.Dislike] }
                                }
                            }
                        },
                        myStatus: {
                            $ifNull: [
                                {
                                    $first: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: '$likes',
                                                    cond: userId ? {
                                                        $eq: ['$this.userId', new mongoose.Types.ObjectId(userId)]
                                                    } : { $eq: [1, 0] }
                                                }
                                            },
                                            in: '$this.status'
                                        }
                                    }
                                },
                                LikeStatus.None
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    likes: 0
                }
            }
        ];

        const results  = await CommentModel.aggregate(pipeline).exec();
        if (!results || results.length === 0) return null;

        return this._mapAggregateToOutput(results[0]);
    }

    async getPostsComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: SortDirection,
        userId: string | null
    ): Promise<CommentPaginatedViewType> {
        const skip: number = (pageNumber - 1) * pageSize;
        const sortOrder: 1 | -1 = sortDirection === 'asc' ? 1 : -1;

        const pipeline: PipelineStage[] = [
            {
                $match: { postId: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: SETTINGS.LIKE_COLLECTION_NAME,
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$parentId', '$commentId'] },
                                        { $eq: ['$parentType', 'comment'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesInfo: {
                        likesCount: {
                            $size: {
                                $filter: {
                                    input: '$likes',
                                    cond: { $eq: ['$this.status', LikeStatus.Like] }
                                }
                            }
                        },
                        dislikesCount: {
                            $size: {
                                $filter: {
                                    input: '$likes',
                                    cond: { $eq: ['$this.status', LikeStatus.Dislike] }
                                }
                            }
                        },
                        myStatus: {
                            $ifNull: [
                                {
                                    $first: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: '$likes',
                                                    cond: userId ? {
                                                        $eq: ['$this.userId', new mongoose.Types.ObjectId(userId)]
                                                    } : { $eq: [1, 0] }
                                                }
                                            },
                                            in: '$this.status'
                                        }
                                    }
                                },
                                LikeStatus.None
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    likes: 0
                }
            },
            {
                $sort: { [sortBy]: sortOrder } as Record<string, 1 | -1>
            },
            {
                $facet: {
                    metadata: [{ $count: "totalCount" }],
                    data: [{ $skip: skip }, { $limit: pageSize }]
                }
            }
        ];

        const results = await CommentModel.aggregate(pipeline).exec();

        const totalCount: number = results[0]?.metadata[0]?.totalCount || 0;
        const pagesCount: number = Math.ceil(totalCount / pageSize);
        const comments: CommentAggregatedType[] = results[0]?.data || [];

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map((comment: CommentAggregatedType): CommentViewType => this._mapAggregateToOutput(comment))
        };
    }

    private _mapAggregateToOutput(comment: CommentAggregatedType): CommentViewType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId.toString(),
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: comment.likesInfo || {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        };
    }
}