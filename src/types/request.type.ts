import {Request} from "express";
import {BlogDBType} from "./blog.type";
import {PostDBType} from "./post.type";

export type RequestWithBody<T> = Request<{}, {}, T>

export type RequestWithQuery<T> = Request<{}, {}, {}, T>

export type RequestWithParams<T> = Request<T>

export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type RequestWithParamsAndBlog<T> = RequestWithParams<T> & {
    blog: BlogDBType;
}

export type RequestWithParamsAndPost<T> = RequestWithParams<T> & {
    post: PostDBType;
}