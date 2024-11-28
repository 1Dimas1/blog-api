import {QueryBlogType} from "../types/blog.type";
import {RequestWithQuery} from "../types/request.type";
import {SortDirection} from "mongodb";

export const paginationQueries = (req: RequestWithQuery<QueryBlogType>) => {
    let searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

    let sortBy: string =  req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection  =
        req.query.sortDirection && req.query.sortDirection.toString() == 'asc' ? 'asc' : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    let pageSize: number = req.query.pageSize ? +req.query.pageSize : 10

    return {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm}
}