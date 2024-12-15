import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {PostDBType, PostInputType, PostType, PostViewType} from "./post.type";
import {postsRepository} from "./posts-repository";
import {BlogDBType} from "../blogs/blog.type";
import {blogsRepository} from "../blogs/blogs-repository";
import {postsQueryRepository} from "./posts-queryRepository";

export const postsService = {
    async createPost(postData: PostInputType): Promise<PostViewType | null> {
        const postsBlog: BlogDBType | null = await blogsRepository.findBlogById(postData.blogId)
        if (!postsBlog) { return null }
        const post: PostType = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: postsBlog._id,
            blogName: postsBlog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostDBType> = await postsRepository.createPost(post)
        return postsQueryRepository.findPostById(result.insertedId.toString())
    },
    async updatePost(id: string, postData: PostInputType): Promise<boolean> {
        const post = {
            title : postData.title,
            shortDescription : postData.shortDescription,
            content : postData.content,
            blogId : new ObjectId(postData.blogId)
        }
        const result: UpdateResult<PostDBType> = await postsRepository.updatePost(id, post)
        return result.matchedCount === 1
    },
    async deletePost(id: string): Promise<boolean> {
        const result: DeleteResult = await postsRepository.deletePost(id)
        return result.deletedCount === 1;
    }
}