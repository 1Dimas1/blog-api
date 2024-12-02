import {DeleteResult, InsertOneResult, ObjectId, SortDirection, UpdateResult} from "mongodb";
import {PostDBType, PostInputType, PostOutPutType, PostsPaginator} from "../types/post.type";
import {postsRepository} from "../repositories/posts-repository";
import {BlogDBType} from "../types/blog.type";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsService = {
    async getPosts(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        filter: any = {}
    ): Promise<PostsPaginator> {
        const posts: PostDBType[] = await postsRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize, filter)
        const postsCount: number = await postsRepository.getPostsCount(filter)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts.map(postsRepository.mapToOutput)
        }
    },
    async findPostById(id: string): Promise<PostOutPutType | null> {
        const post: PostDBType | null = await postsRepository.findPostById(id)
        if (post){
            return postsRepository.mapToOutput(post);
        }
        return null;
    },
    async createPost(body: PostInputType): Promise<PostOutPutType | null> {
        const postsBlog: BlogDBType | null = await blogsRepository.findBlogById(body.blogId)
        if (!postsBlog) { return null }
        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: postsBlog._id,
            blogName: postsBlog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostDBType> = await postsRepository.createPost(post)
        return postsRepository.mapToOutput(post)
    },
    async updatePost(id: string, body: PostInputType): Promise<UpdateResult<PostDBType>> {
        const post = {
            title : body.title,
            shortDescription : body.shortDescription,
            content : body.content,
            blogId : new ObjectId(body.blogId)
        }
        return postsRepository.updatePost(id, post)
    },
    async deletePost(id: string): Promise<DeleteResult> {
        return postsRepository.deletePost(id)
    }
}