import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";
import {BlogDBType, BlogInputType, BlogType, BlogViewModel} from "./blog.type";
import BlogsRepository from "./blogs-repository";
import BlogsQueryRepository from "./blogs-query-repository";
import {injectable, inject} from "inversify";

@injectable()
export default class BlogsService {
    constructor(
        @inject(BlogsRepository)
        private blogsRepository: BlogsRepository,
        @inject(BlogsQueryRepository)
        private blogsQueryRepository: BlogsQueryRepository,) {}

    async createBlog(blogData: BlogInputType): Promise<BlogViewModel | null> {
        const blog: BlogType = {
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogDBType> = await this.blogsRepository.createBlog(blog);
        return this.blogsQueryRepository.findBlogById(result.insertedId.toString());
    }

    async updateBlog(id: string, blogData: BlogInputType): Promise<boolean> {
        const blog = {
            name: blogData.name,
            description: blogData.description,
            websiteUrl: blogData.websiteUrl,
        }
        const result: UpdateResult<BlogDBType> = await this.blogsRepository.updateBlog(id, blog)
        return result.matchedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result: DeleteResult = await this.blogsRepository.deleteBlog(id)
        return result.deletedCount === 1
    }
}