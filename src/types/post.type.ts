import {ObjectId, SortDirection} from "mongodb";

export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string
}

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

export type PostOutPutType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
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

export type PostsPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostOutPutType[]
}