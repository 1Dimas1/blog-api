import {BlogDocument, BlogViewType} from "./blog.type";
import {SortDirection} from "mongodb";
import {injectable} from "inversify";
import {BlogModel} from "./blog-model";

@injectable()
export default class BlogsQueryRepository {
    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        filter: any
    ): Promise<BlogViewType[]> {
        const blogs: BlogDocument[] = await BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        return blogs.map(this._mapToOutput);
    }

    async findBlogById(id: string): Promise<BlogViewType | null> {
        const blog: BlogDocument | null = await BlogModel.findById(id).exec();
        return blog ? this._mapToOutput(blog) : null;
    }

    async getBlogsCount(filter: any): Promise<number> {
        return BlogModel.countDocuments(filter).exec();
    }

    _mapToOutput(blog: BlogDocument): BlogViewType {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership
        };
    }
}