import {SortDirection, WithId} from "mongodb";

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogDBType = WithId<BlogType>

export type BlogViewModel = BlogType & {
    id: string
}

export type BlogsPaginatedViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
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