import {NextFunction, Response} from "express";
import {RequestWithParams} from "../types/request.type";
import {BlogDBType, BlogIdParams} from "../../features/blogs/blog.type";
import {blogsRepository} from "../../features/blogs/blogs-repository";
import {HTTP_CODES} from "../../settings";
import {PostDBType, URIParamsPostIdType} from "../../features/posts/post.type";
import {postsRepository} from "../../features/posts/posts-repository";
import {usersRepository} from "../../features/users/users-repository";
import {URIParamsUserIdType, UserDBType} from "../../features/users/user.type";

export const validateBlogExistsMiddleware = async (
    req: RequestWithParams<BlogIdParams>,
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

export const validateUserExistsMiddleware = async (
    req: RequestWithParams<URIParamsUserIdType>,
    res: Response,
    next: NextFunction,
) => {
    const userId: string = req.params.id
    const user: UserDBType | null = await usersRepository.findUserById(userId)
    if (!user) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    next();
}