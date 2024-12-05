import {ObjectId, SortDirection} from "mongodb";

export type BlogDBType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogOutPutType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type URIParamsBlogIdType = {
    id: string,
}

export type URIParamsPostsBlogIdType = {
    blogId: string,
}

export type QueryBlogType = {
    searchNameTerm?: string | null,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string
}

export type BlogsPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogOutPutType[]
}
