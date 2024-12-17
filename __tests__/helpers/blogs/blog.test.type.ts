export type BlogDto = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogInputDto = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogsResponse = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogDto[]
}