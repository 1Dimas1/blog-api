import {SortDirection} from "mongodb";
import mongoose, {HydratedDocument, Model} from "mongoose";
export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: mongoose.Types.ObjectId,
    blogName: string,
    createdAt: Date
}

export type PostDBUpdateType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: mongoose.Types.ObjectId,
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

export type PostsPaginatedViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewType[]
}

export type PostIdParams = {
    id: string
}

export type PostDocument = HydratedDocument<PostType>

export type PostModelType = Model<PostType, {}, {}, {}, PostDocument>