import {BlogDocument, BlogInputType, BlogType} from "./blog.type";
import {DeleteResult, UpdateResult} from "mongodb";
import {injectable} from "inversify";
import {BlogModel} from "./blog-model";

@injectable()
export default class BlogsRepository {
    async findBlogById(id: string): Promise<BlogDocument | null> {
        return BlogModel.findById(id).exec();
    }

    async createBlog(blog: BlogType): Promise<BlogDocument> {
        return BlogModel.insertOne(blog);
    }

    async updateBlog(id: string, blog: BlogInputType): Promise<UpdateResult<BlogDocument>> {
        return BlogModel.updateOne(
            { _id: id },
            blog
        );
    }

    async deleteBlog(id: string): Promise<DeleteResult> {
        return BlogModel.deleteOne({ _id: id });
    }
}