import {QueryBlogType} from "../../features/blogs/blog.type";
import {RequestWithParamsAndQuery, RequestWithQuery} from "../types/request.type";
import {SortDirection} from "mongodb";
import {PostIdParams, QueryPostType} from "../../features/posts/post.type";
import {QueryUserType} from "../../features/users/user.type";
import {QueryCommentType} from "../../features/comments/comment.type";

export const paginationBlogQueries = (req: RequestWithQuery<QueryBlogType>) => {
    let searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

    let sortBy: string =  req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection  =
        req.query.sortDirection && req.query.sortDirection.toString() == 'asc' ? 'asc' : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10

    return {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm}
}

export const paginationPostQueries = (req: RequestWithQuery<QueryPostType>) => {

    let sortBy: string =  req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection  =
        req.query.sortDirection && req.query.sortDirection.toString() == 'asc' ? 'asc' : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10

    return {sortBy, sortDirection, pageNumber, pageSize}
}

export const paginationUserQueries = (req: RequestWithQuery<QueryUserType>) => {

    let sortBy: string =  req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection  =
        req.query.sortDirection && req.query.sortDirection.toString() == 'asc' ? 'asc' : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    let searchLoginTerm: string | null = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
    let searchEmailTerm: string | null = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null

    return {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm}
}

export const paginationCommentQueries = (req: RequestWithParamsAndQuery<PostIdParams, QueryCommentType>) => {

    const postId: string = req.params.id.toString();
    let sortBy: string =  req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection  =
        req.query.sortDirection && req.query.sortDirection.toString() == 'asc' ? 'asc' : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10

    return {postId, sortBy, sortDirection, pageNumber, pageSize}
}