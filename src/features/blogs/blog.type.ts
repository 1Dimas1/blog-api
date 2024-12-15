import { WithId, SortDirection } from "mongodb";

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

export type BlogsPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}

export type QueryBlogDto = {
    searchNameTerm?: string | null,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string
}

export type BlogIdParams = {
    id: string
}