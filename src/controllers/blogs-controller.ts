import {Response} from 'express'
import {HTTP_CODES} from "../settings";
import {BlogInputType, BlogOutPutType, BlogsPaginator, QueryBlogType, URIParamsBlogIdType} from "../types/blog.type";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types/request.type";
import {blogsService} from "../services/blogs-service";
import {paginationBlogQueries} from "../helpers/pagination-values";

export const blogsController = {
    async getBlogs(req: RequestWithQuery<QueryBlogType>, res: Response<BlogsPaginator>) {
        const {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm} = paginationBlogQueries(req)
        const blogs: BlogsPaginator = await blogsService.getBlogs(sortBy, sortDirection, pageNumber, pageSize, searchNameTerm)
        res.status(HTTP_CODES.OK_200).json(blogs)
    },
    async getBlogById(req: RequestWithParams<URIParamsBlogIdType>, res: Response<BlogOutPutType>) {
        const blog: BlogOutPutType | null = await blogsService.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(blog);
    },
    async createBlog(req: RequestWithBody<BlogInputType>, res: Response<BlogOutPutType>) {
        const newBlog: BlogOutPutType = await blogsService.createBlog(req.body)
        res.status(HTTP_CODES.CREATED_201).json(newBlog)
    },
    async updateBlog(req: RequestWithParamsAndBody<URIParamsBlogIdType,BlogInputType>, res: Response) {
        await blogsService.updateBlog(req.params.id, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deleteBlog(req: RequestWithParams<URIParamsBlogIdType>, res: Response) {
        await blogsService.deleteBlog(req.params.id)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}