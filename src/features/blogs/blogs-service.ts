import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";
import {BlogDBType, BlogInputType, BlogType, BlogViewModel} from "./blog.type";
import {blogsRepository} from "./blogs-repository";
import {postsService} from "../posts/posts-service";
import {PostCreateByBlogIdInputType, PostInputType, PostViewType} from "../posts/post.type";
import {blogsQueryRepository} from "./blogs-queryRepository";

export const blogsService = {
    async createBlog(blogData: BlogInputType): Promise<BlogViewModel | null> {
        const blog: BlogType = {
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogDBType> = await blogsRepository.createBlog(blog);
        return blogsQueryRepository.findBlogById(result.insertedId.toString());
    },
    async createPostByBlogId(blogId: string, body: PostCreateByBlogIdInputType): Promise<PostViewType | null> {
        const bodyForPostCreation: PostInputType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
        }
        return postsService.createPost(bodyForPostCreation)
    },
    async updateBlog(id: string, blogData: BlogInputType): Promise<boolean> {
        const blog = {
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
        }
        const result: UpdateResult<BlogDBType> = await blogsRepository.updateBlog(id, blog)
        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    }
}