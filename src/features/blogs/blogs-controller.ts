import {Response} from 'express'
import { inject, injectable } from 'inversify';
import {
    BlogInputType, BlogViewModel, BlogsPaginatedViewModel, QueryBlogType,
    BlogIdParams,
} from "./blog.type";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../common/types/request.type";
import BlogsService from "./blogs-service";
import {paginationBlogQueries, paginationPostQueries} from "../../common/helpers/pagination-values";
import {
    PostCreateByBlogIdInputType,
    PostViewType,
    PostsPaginatedViewModel,
    QueryPostType,
    PostInputType
} from "../posts/post.type";
import BlogsQueryService from "./blogs-query-service";
import BlogsQueryRepository from "./blogs-query-repository";
import PostsQueryService from "../posts/posts-query-service";
import PostsService from "../posts/posts-service";
import {HTTP_CODES} from "../../common/http.statuses";

@injectable()
export default class BlogsController {
    constructor(
        @inject(BlogsService)
        private blogsService: BlogsService,
        @inject(BlogsQueryService)
        private blogsQueryService: BlogsQueryService,
        @inject(BlogsQueryRepository)
        private blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsService)
        private postsService: PostsService,
        @inject(PostsQueryService)
        private postsQueryService: PostsQueryService
    ) {}

    async getBlogs(req: RequestWithQuery<QueryBlogType>, res: Response<BlogsPaginatedViewModel>) {
        const {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm} = paginationBlogQueries(req)
        const blogs: BlogsPaginatedViewModel = await this.blogsQueryService.getBlogs(sortBy, sortDirection, pageNumber, pageSize, searchNameTerm)
        res.status(HTTP_CODES.OK_200).json(blogs)
    }

    async getBlogById(req: RequestWithParams<BlogIdParams>, res: Response<BlogViewModel>) {
        const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(blog);
    }

    async getPostsByBlogId(req: RequestWithParamsAndQuery<BlogIdParams, QueryPostType>, res: Response<PostsPaginatedViewModel>)  {
        const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        const {sortBy, sortDirection, pageNumber, pageSize} = paginationPostQueries(req)
        const posts: PostsPaginatedViewModel = await this.postsQueryService.getPosts(sortBy, sortDirection, pageNumber, pageSize, req.params.id)
        res.status(HTTP_CODES.OK_200).json(posts);
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<BlogIdParams, PostCreateByBlogIdInputType>, res: Response<PostViewType>) {
        const blog: BlogViewModel | null = await this.blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        const post: PostInputType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.id,
        }
        const newPost: PostViewType | null = await this.postsService.createPost(post)
        if (!newPost) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    }

    async createBlog(req: RequestWithBody<BlogInputType>, res: Response<BlogViewModel>) {
        const newBlog: BlogViewModel | null = await this.blogsService.createBlog(req.body)
        if(!newBlog) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_CODES.CREATED_201).json(newBlog)
    }

    async updateBlog(req: RequestWithParamsAndBody<BlogIdParams, BlogInputType>, res: Response) {
        const isUpdated: boolean = await this.blogsService.updateBlog(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }

    async deleteBlog(req: RequestWithParams<BlogIdParams>, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.id)
        if (!isDeleted) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}