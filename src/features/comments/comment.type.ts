import {SortDirection} from 'mongodb';
import mongoose, {HydratedDocument, Model} from "mongoose";
import {LikesInfoViewType} from "../likes/like.type";

export type CommentInputType = {
    content: string;
};

export type CommentatorInfoType = {
    userId: mongoose.Types.ObjectId;
    userLogin: string;
}

export type CommentType = {
    content: string;
    commentatorInfo: CommentatorInfoType
    postId: mongoose.Types.ObjectId;
    createdAt: Date;
};

export type CommentViewType = Omit<CommentType, "postId" | "commentatorInfo"> & {
    id: string;
    commentatorInfo: Omit<CommentatorInfoType, "userId"> & { userId: string };
    likesInfo: LikesInfoViewType
};


export type QueryCommentType = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: SortDirection;
};

export type CommentPaginatedViewType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewType[];
};

export type CommentIdParams = {
    id: string
}

export type CommentDocument = HydratedDocument<CommentType>

export type CommentModelType = Model<CommentType, {}, {}, {}, CommentDocument>

export type CommentAggregatedDocument = CommentDocument & {
    likesInfo: LikesInfoViewType
}

export type CommentPage = {
    metadata: { totalCount: number }[];
    data:     CommentAggregatedDocument[];
}