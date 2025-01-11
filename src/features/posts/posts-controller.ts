import {Response} from "express";
import {PostInputType, PostViewType, PostsPaginatedViewModel, QueryPostType} from "./post.type";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../common/types/request.type";
import {BlogIdParams} from "../blogs/blog.type";
import {paginationPostQueries} from "../../common/helpers/pagination-values";
import {postsService} from "./posts-service";
import {postsQueryRepository} from "./posts-queryRepository";
import {postsQueryService} from "./posts-queryService";
import {HTTP_CODES} from "../../common/http.statuses";

export const postsController = {
    async getPosts(req: RequestWithQuery<QueryPostType>, res: Response<PostsPaginatedViewModel>) {
        const {sortBy, sortDirection, pageNumber, pageSize} = paginationPostQueries(req)
        const posts: PostsPaginatedViewModel = await postsQueryService.getPosts(sortBy, sortDirection, pageNumber, pageSize)
        res.status(HTTP_CODES.OK_200).json(posts)
    },
    async getPostById(req: RequestWithParams<BlogIdParams>, res: Response<PostViewType>) {
        const post: PostViewType | null = await postsQueryRepository.findPostById(req.params.id)
        if (!post){
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(post);
    },
    async createPost(req: RequestWithBody<PostInputType>, res: Response<PostViewType>) {
        const newPost: PostViewType | null = await postsService.createPost(req.body)
        if (!newPost) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    },
    async updatePost(req: RequestWithParams<BlogIdParams>, res: Response){
        const isUpdated = await postsService.updatePost(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deletePost(req: RequestWithParams<BlogIdParams>, res: Response) {
        const isDeleted = await postsService.deletePost((req.params.id))
        if (!isDeleted) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}