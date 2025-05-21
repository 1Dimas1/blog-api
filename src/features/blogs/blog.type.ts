import {SortDirection} from "mongodb";
import {HydratedDocument, Model} from 'mongoose';

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}

export type BlogViewType = Omit<BlogType, "createdAt"> & {
    id: string,
    createdAt: string
}

export type BlogInputType = Omit<BlogType, "createdAt" | "isMembership">

export type BlogsPaginatedViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewType[]
}

export type QueryBlogType = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string
}

export type BlogIdParams = {
    id: string
}

export type BlogDocument = HydratedDocument<BlogType>

export type BlogModelType = Model<BlogType, {}, {}, {}, BlogDocument>