import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";
import {BlogDBType, BlogInputType, BlogType, BlogViewModel} from "./blog.type";
import {blogsRepository} from "./blogs-repository";
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