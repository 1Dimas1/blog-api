import {BlogDBType, BlogInputType, BlogOutPutType} from "../types/blog.type";
import {blogCollection} from "../db/db";
import {ObjectId, SortDirection} from "mongodb";

export const blogsRepository = {
    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        filter: any
    ): Promise<BlogDBType[]> {
        return blogCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async createBlog(body: BlogInputType): Promise<BlogOutPutType> {
        const blog: BlogDBType = {
            _id: new ObjectId(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne(blog)
        return this.mapToOutput(blog)
    },
    async updateBlog(id: string, body: BlogInputType) {
        return blogCollection.updateOne({_id: new ObjectId(id)}, {$set: body})
    },
    async findBlogById(id: string): Promise<BlogDBType | null> {
        return blogCollection.findOne({_id: new ObjectId(id)});
    },
    async getBlogsCount(filter: any):Promise<number> {
        return blogCollection.countDocuments(filter)
    },
    async deleteBlog(id: string){
        return blogCollection.deleteOne({_id: new ObjectId(id)})
    },
    mapToOutput(blog: BlogDBType): BlogOutPutType { //mapping can be moved to another repository object
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}