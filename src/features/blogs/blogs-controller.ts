import {Response} from 'express'
import {
    BlogInputType, BlogViewModel, BlogsPaginator, QueryBlogDto,
    BlogIdParams,
} from "./blog.type";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../common/types/request.type";
import {blogsService} from "./blogs-service";
import {paginationBlogQueries, paginationPostQueries} from "../../common/helpers/pagination-values";
import {
    PostCreateByBlogIdInputType,
    PostViewType,
    PostsPaginator,
    QueryPostType,
    PostInputType
} from "../posts/post.type";
import {blogsQueryService} from "./blogs-queryService";
import {blogsQueryRepository} from "./blogs-queryRepository";
import {postsQueryService} from "../posts/posts-queryService";
import {postsService} from "../posts/posts-service";
import {HTTP_CODES} from "../../common/http.statuses";

export const blogsController = {
    async getBlogs(req: RequestWithQuery<QueryBlogDto>, res: Response<BlogsPaginator>) {
        const {sortBy, sortDirection, pageNumber, pageSize, searchNameTerm} = paginationBlogQueries(req)
        const blogs: BlogsPaginator = await blogsQueryService.getBlogs(sortBy, sortDirection, pageNumber, pageSize, searchNameTerm)
        res.status(HTTP_CODES.OK_200).json(blogs)
    },
    async getBlogById(req: RequestWithParams<BlogIdParams>, res: Response<BlogViewModel>) {
        const blog: BlogViewModel | null = await blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(blog);
    },
    async getPostsByBlogId(req: RequestWithParamsAndQuery<BlogIdParams, QueryPostType>, res: Response<PostsPaginator>)  {
        const blog: BlogViewModel | null = await blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        const {sortBy, sortDirection, pageNumber, pageSize} = paginationPostQueries(req)
        const posts: PostsPaginator = await postsQueryService.getPosts(sortBy, sortDirection, pageNumber, pageSize, req.params.id)
        res.status(HTTP_CODES.OK_200).json(posts);
    },
    async createPostByBlogId(req: RequestWithParamsAndBody<BlogIdParams, PostCreateByBlogIdInputType>, res: Response<PostViewType>) {
        const blog: BlogViewModel | null = await blogsQueryRepository.findBlogById(req.params.id)
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
        const newPost: PostViewType | null = await postsService.createPost(post)
        if (!newPost) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    },
    async createBlog(req: RequestWithBody<BlogInputType>, res: Response<BlogViewModel>) {
        const newBlog: BlogViewModel | null = await blogsService.createBlog(req.body)
        if(!newBlog) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_CODES.CREATED_201).json(newBlog)
    },
    async updateBlog(req: RequestWithParamsAndBody<BlogIdParams, BlogInputType>, res: Response) {
        const isUpdated: boolean = await blogsService.updateBlog(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deleteBlog(req: RequestWithParams<BlogIdParams>, res: Response) {
        const isDeleted: boolean = await blogsService.deleteBlog(req.params.id)
        if (!isDeleted) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}