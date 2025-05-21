import {DeleteResult, UpdateResult} from "mongodb";
import {PostDBUpdateType, PostDocument, PostInputType, PostType, PostViewType} from "./post.type";
import PostsRepository from "./posts-repository";
import {BlogDocument} from "../blogs/blog.type";
import BlogsRepository from "../blogs/blogs-repository";
import PostsQueryRepository from "./posts-query-repository";
import {inject, injectable} from "inversify";
import mongoose from "mongoose";

@injectable()
export default class PostsService {
    constructor(
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository,
        @inject(PostsQueryRepository)
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    async createPost(postData: PostInputType): Promise<PostViewType | null> {
        const postsBlog: BlogDocument | null = await this.blogsRepository.findBlogById(postData.blogId)
        if (!postsBlog) { return null }

        const post: PostType = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: postsBlog._id,
            blogName: postsBlog.name,
            createdAt: new Date()
        }
        const result: PostDocument = await this.postsRepository.createPost(post)
        return this.postsQueryRepository.findPostById(result.id)
    }

    async updatePost(id: string, postData: PostInputType): Promise<boolean> {
        const post: PostDBUpdateType = {
            title : postData.title,
            shortDescription : postData.shortDescription,
            content : postData.content,
            blogId : new mongoose.Types.ObjectId(postData.blogId)
        }
        const result: UpdateResult<PostDocument> = await this.postsRepository.updatePost(id, post)
        return result.matchedCount === 1
    }

    async deletePost(id: string): Promise<boolean> {
        const result: DeleteResult = await this.postsRepository.deletePost(id)
        return result.deletedCount === 1;
    }
}