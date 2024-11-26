import {NextFunction, Response} from "express";
import {RequestWithParams} from "../types/request.type";
import {BlogDBType, URIParamsBlogIdType} from "../types/blog.type";
import {blogsRepository} from "../repositories/blogs-repository";
import {HTTP_CODES} from "../settings";
import {PostDBType, URIParamsPostIdType} from "../types/post.type";
import {postsRepository} from "../repositories/posts-repository";

export const validateBlogExistsMiddleware = async (
    req: RequestWithParams<URIParamsBlogIdType>,
    res: Response,
    next: NextFunction,
) => {
    const blogId: string = req.params.id
    const blog: BlogDBType | null = await blogsRepository.findBlogById(blogId)
    if (!blog) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    next();
}

export const validatePostExistsMiddleware = async (
    req: RequestWithParams<URIParamsPostIdType>,
    res: Response,
    next: NextFunction,
) => {
    const postId: string = req.params.id
    const post: PostDBType | null = await postsRepository.findPostById(postId)
    if (!post) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    next();
}