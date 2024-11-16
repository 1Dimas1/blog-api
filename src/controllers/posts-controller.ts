import {Request, Response} from "express";
import {HTTP_CODES} from "../settings";
import {PostInputType, PostOutPutType} from "../types/post.type";
import {postsRepository} from "../repositories/posts-repository";
import {RequestWithBody, RequestWithParamsAndPost} from "../types/request.type";
import {URIParamsBlogIdType} from "../types/blog.type";

export const postsController = {
    getPosts(req: Request, res: Response<PostOutPutType[]>) {
        const posts: Array<PostOutPutType> = postsRepository.getPostsForOutPut()
        res.status(HTTP_CODES.OK_200).json(posts)
    },
    getPostById(req: RequestWithParamsAndPost<URIParamsBlogIdType>, res: Response<PostOutPutType>) {
        res.status(HTTP_CODES.OK_200).json(postsRepository.mapToOutput(req.post));
        return;
    },
    createPost(req: RequestWithBody<PostInputType>, res: Response<PostOutPutType>) {
        const newPost: PostOutPutType | undefined = postsRepository.createPost(req.body)
        res.status(HTTP_CODES.CREATED_201).json(newPost)
    },
    updatePost(req: RequestWithParamsAndPost<URIParamsBlogIdType>, res: Response){
        postsRepository.updatePost(req.post, req.body)
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    },
    deletePost(req: RequestWithParamsAndPost<URIParamsBlogIdType>, res: Response) {
        postsRepository.deletePost((req.post.id))
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}