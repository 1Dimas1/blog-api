import {Request, Response} from 'express'
import {HTTP_CODES} from "../settings";
import {blogsRepository} from "../repositories/blogs-repository";
import {BlogInputType, BlogOutPutType, URIParamsBlogIdType} from "../types/blog.type";
import {RequestWithBody, RequestWithParamsAndBlog} from "../types/request.type";

export const blogsController = {
    getBlogs(req: Request, res: Response<BlogOutPutType[]>) {
        const blogs: Array<BlogOutPutType> = blogsRepository.getBlogsForOutPut()
        res.status(HTTP_CODES.OK_200).json(blogs)
    },
    getBlogById(req: RequestWithParamsAndBlog<URIParamsBlogIdType>, res: Response<BlogOutPutType>) {
        res.status(HTTP_CODES.OK_200).json(blogsRepository.mapToOutput(req.blog));
        return;
    },
    createBlog(req: RequestWithBody<BlogInputType>, res: Response<BlogOutPutType>) {
        const newBlog: BlogOutPutType = blogsRepository.createBlog(req.body)
        res.status(HTTP_CODES.CREATED_201).json(newBlog)
    },
    updateBlog(req: RequestWithParamsAndBlog<URIParamsBlogIdType>, res: Response) {
        blogsRepository.updateBlog(req.blog, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    deleteBlog(req: RequestWithParamsAndBlog<URIParamsBlogIdType>, res: Response) {
        blogsRepository.deleteBlog(req.blog.id)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}