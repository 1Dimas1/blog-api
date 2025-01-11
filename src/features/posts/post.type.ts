import {ObjectId, SortDirection, WithId} from "mongodb";

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string
}

export type PostDBType = WithId<PostType>

export type PostDBUpdateType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
}

export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostCreateByBlogIdInputType = {
    title: string,
    shortDescription: string,
    content: string,
}

export type PostViewType = Omit<PostType, 'blogId'> & {
    id: string,
    blogId: string,
}

export type URIParamsPostIdType = {
    id: string,
}

export type QueryPostType = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string
}

export type PostsPaginatedViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewType[]
}

export type PostIdParams = {
    id: string
}