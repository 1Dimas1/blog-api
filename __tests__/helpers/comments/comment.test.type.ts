export type CommentDto = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

export type CommentInputDto = {
    content: string
}

export type CommentsResponse = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentDto[]
}