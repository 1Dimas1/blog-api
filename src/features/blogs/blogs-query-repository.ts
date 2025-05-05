import {BlogDBType, BlogViewModel} from "./blog.type";
import {blogCollection} from "../../db/db";
import {ObjectId, SortDirection} from "mongodb";
import {injectable} from "inversify";

@injectable()
export default class BlogsQueryRepository {
    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        filter: any
    ): Promise<BlogViewModel[]> {
        const blogs: BlogDBType[] = await blogCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return blogs.map(this._mapToOutput);
    }

    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const blog: BlogDBType | null = await blogCollection.findOne({ _id: new ObjectId(id) });
        return blog ? this._mapToOutput(blog) : null;
    }

    async getBlogsCount(filter: any): Promise<number> {
        return blogCollection.countDocuments(filter);
    }

    _mapToOutput(blog: BlogDBType): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
    }
}