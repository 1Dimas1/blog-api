import {Request, Response} from 'express'
import {HTTP_CODES} from "../settings";
import {blogsRepository} from "../repositories/blogs-repository";
import {
    BlogDBType,
    BlogInputType,
    BlogOutPutType,
    BlogsPaginator,
    QueryBlogType,
    URIParamsBlogIdType
} from "../types/blog.type";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request.type";
import {SortDirection} from "mongodb";
import {blogsService} from "../services/blogs-service";
import {paginationQueries} from "../helpers/pagination-values";

export const blogsController = {
    async getBlogs(req: RequestWithQuery<QueryBlogType>, res: Response<BlogsPaginator>) {
        const {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm} = paginationQueries(req)
        const blogs: BlogsPaginator = await blogsService.getBlogs(sortBy, sortDirection, pageNumber, pageSize, searchNameTerm)

        res.status(HTTP_CODES.OK_200).json(blogs)
    },
    async getBlogById(req: RequestWithParams<URIParamsBlogIdType>, res: Response<BlogOutPutType>) {
        const blog: BlogDBType | null = await blogsRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(blogsRepository.mapToOutput(blog));
        return;
    },
    async createBlog(req: RequestWithBody<BlogInputType>, res: Response<BlogOutPutType>) {
        const newBlog: BlogOutPutType = await blogsRepository.createBlog(req.body)
        res.status(HTTP_CODES.CREATED_201).json(newBlog)
    },
    async updateBlog(req: RequestWithParams<URIParamsBlogIdType>, res: Response) {
        await blogsRepository.updateBlog(req.params.id, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deleteBlog(req: RequestWithParams<URIParamsBlogIdType>, res: Response) {
        await blogsRepository.deleteBlog(req.params.id)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}