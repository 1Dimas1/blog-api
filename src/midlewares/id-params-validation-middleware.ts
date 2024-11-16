import {NextFunction, Response} from "express";
import {RequestWithParams, RequestWithParamsAndBlog, RequestWithParamsAndPost} from "../types/request.type";
import {BlogDBType, URIParamsBlogIdType} from "../types/blog.type";
import {blogsRepository} from "../repositories/blogs-repository";
import {HTTP_CODES} from "../settings";
import {PostDBType, URIParamsPostIdType} from "../types/post.type";
import {postsRepository} from "../repositories/posts-repository";

export const validateBlogExistsMiddleware = (
    req: RequestWithParams<URIParamsBlogIdType>,
    res: Response,
    next: NextFunction,
) => {
    const blogId: string = req.params.id
    const blog: BlogDBType | undefined = blogsRepository.findBlogById(blogId)
    if (!blog) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    (req as RequestWithParamsAndBlog<URIParamsBlogIdType>).blog = blog;
    next();
}

export const validatePostExistsMiddleware = (
    req: RequestWithParams<URIParamsPostIdType>,
    res: Response,
    next: NextFunction,
) => {
    const postId: string = req.params.id
    const post: PostDBType | undefined = postsRepository.findPostById(postId)
    if (!post) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    (req as RequestWithParamsAndPost<URIParamsBlogIdType>).post = post;
    next();
}