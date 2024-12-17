export type PostDto = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostInputDto = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostCreateByBlogIdDto = {
    title: string
    shortDescription: string
    content: string
}

export type PostsResponse = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostDto[]
}