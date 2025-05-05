import {NextFunction, Response} from "express";
import {RequestWithParams} from "../types/request.type";
import {BlogDBType, BlogIdParams} from "../../features/blogs/blog.type";
import BlogsRepository from "../../features/blogs/blogs-repository";
import {PostDBType, URIParamsPostIdType} from "../../features/posts/post.type";
import PostsRepository from "../../features/posts/posts-repository";
import UsersRepository from "../../features/users/users-repository";
import {URIParamsUserIdType, UserDBType} from "../../features/users/user.type";
import {HTTP_CODES} from "../http.statuses";
import container from "../../container/inversify.config";

export const validateBlogExistsMiddleware = async (
    req: RequestWithParams<BlogIdParams>,
    res: Response,
    next: NextFunction,
) => {
    const blogsRepository: BlogsRepository = new BlogsRepository()
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
    const postsRepository: PostsRepository = new PostsRepository()
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
    const usersRepository: UsersRepository = container.get(UsersRepository)

    const userId: string = req.params.id
    const user: UserDBType | null = await usersRepository.findUserById(userId)
    if (!user) {
        res.sendStatus(HTTP_CODES.NOT_FOUND_404)
        return;
    }
    next();
}