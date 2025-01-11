import {ObjectId, SortDirection, WithId} from 'mongodb';

export type CommentInputType = {
    content: string;
};

export type CommentType = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: ObjectId,
    createdAt: string;
};

export type CommentViewModel = Omit<CommentType, 'postId'> & {
    id: string;
};

export type CommentDBType = WithId<CommentType>;

export type QueryCommentType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
};

export type CommentPaginatedViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
};

export type CommentIdParams = {
    id: string
}