import {BlogDBType, BlogInputType, BlogOutPutType} from "../types/blog.type";
import {blogCollection} from "../db/db";
import {InsertOneResult, ObjectId, SortDirection, UpdateResult, DeleteResult} from "mongodb";

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
    async createBlog(blog: BlogDBType): Promise<InsertOneResult<BlogDBType>> {
        return await blogCollection.insertOne(blog);
    },
    async updateBlog(id: string, blog: BlogInputType): Promise<UpdateResult<BlogDBType>> {
        return blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blog})
    },
    async findBlogById(id: string): Promise<BlogDBType | null> {
        return blogCollection.findOne({_id: new ObjectId(id)});
    },
    async getBlogsCount(filter: any):Promise<number> {
        return blogCollection.countDocuments(filter)
    },
    async deleteBlog(id: string): Promise<DeleteResult>{
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