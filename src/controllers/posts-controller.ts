import {Request, Response} from "express";
import {HTTP_CODES} from "../settings";
import {PostDBType, PostInputType, PostOutPutType} from "../types/post.type";
import {postsRepository} from "../repositories/posts-repository";
import {RequestWithBody, RequestWithParams} from "../types/request.type";
import {URIParamsBlogIdType} from "../types/blog.type";

export const postsController = {
    async getPosts(req: Request, res: Response<PostOutPutType[]>) {
        const posts: Array<PostDBType> = await postsRepository.getPosts()
        res.status(HTTP_CODES.OK_200).json(posts.map(postsRepository.mapToOutput))
    },
    async getPostById(req: RequestWithParams<URIParamsBlogIdType>, res: Response<PostOutPutType>) {
        const post: PostDBType | null = await postsRepository.findPostById(req.params.id)
        if (!post){
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.OK_200).json(postsRepository.mapToOutput(post));
        return;
    },
    async createPost(req: RequestWithBody<PostInputType>, res: Response<PostOutPutType>) {
        const newPost: PostOutPutType | null = await postsRepository.createPost(req.body)
        if (!newPost) {
            res.status(HTTP_CODES.BAD_REQUEST_400)
            return
        }
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    },
    async updatePost(req: RequestWithParams<URIParamsBlogIdType>, res: Response){
        await postsRepository.updatePost(req.params.id, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    async deletePost(req: RequestWithParams<URIParamsBlogIdType>, res: Response) {
        await postsRepository.deletePost((req.params.id))
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}