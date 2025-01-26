import {BlogDBType, BlogInputType, BlogType} from "./blog.type";
import {blogCollection} from "../../db/db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogDBType | null> {
        return blogCollection.findOne({ _id: new ObjectId(id) });
    },

    async createBlog(blog: BlogType): Promise<InsertOneResult<BlogDBType>> {
        return blogCollection.insertOne(blog);
    },

    async updateBlog(id: string, blog: BlogInputType): Promise<UpdateResult<BlogDBType>> {
        return blogCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: blog }
        );
    },

    async deleteBlog(id: string): Promise<DeleteResult> {
        return blogCollection.deleteOne({ _id: new ObjectId(id) });
    }
}