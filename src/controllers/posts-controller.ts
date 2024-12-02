import {Response} from "express";
import {HTTP_CODES} from "../settings";
import {PostInputType, PostOutPutType, PostsPaginator, QueryPostType} from "../types/post.type";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request.type";
import {URIParamsBlogIdType} from "../types/blog.type";
import {paginationPostQueries} from "../helpers/pagination-values";
import {postsService} from "../services/posts-service";

export const postsController = {
    async getPosts(req: RequestWithQuery<QueryPostType>, res: Response<PostsPaginator>) {
        const {sortBy, sortDirection, pageNumber, pageSize} = paginationPostQueries(req)
        const posts: PostsPaginator = await postsService.getPosts(sortBy, sortDirection, pageNumber, pageSize)
        res.status(HTTP_CODES.OK_200).json(posts)
    },
    async getPostById(req: RequestWithParams<URIParamsBlogIdType>, res: Response<PostOutPutType>) {
        const post: PostOutPutType | null = await postsService.findPostById(req.params.id)
        if (!post){
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(post);
    },
    async createPost(req: RequestWithBody<PostInputType>, res: Response<PostOutPutType>) {
        const newPost: PostOutPutType | null = await postsService.createPost(req.body)
        if (!newPost) {
            res.status(HTTP_CODES.BAD_REQUEST_400)
            return;
        }
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    },
    async updatePost(req: RequestWithParams<URIParamsBlogIdType>, res: Response){
        await postsService.updatePost(req.params.id, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deletePost(req: RequestWithParams<URIParamsBlogIdType>, res: Response) {
        await postsService.deletePost((req.params.id))
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}