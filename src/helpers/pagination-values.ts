import {QueryBlogType} from "../types/blog.type";
import {RequestWithQuery} from "../types/request.type";
import {SortDirection} from "mongodb";
import {QueryPostType} from "../types/post.type";

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