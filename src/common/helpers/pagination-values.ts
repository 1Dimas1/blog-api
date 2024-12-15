import {QueryBlogDto} from "../../features/blogs/blog.type";
import {RequestWithQuery} from "../types/request.type";
import {SortDirection} from "mongodb";
import {QueryPostType} from "../../features/posts/post.type";
import {QueryUserType} from "../../features/users/user.type";

export const paginationBlogQueries = (req: RequestWithQuery<QueryBlogDto>) => {
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