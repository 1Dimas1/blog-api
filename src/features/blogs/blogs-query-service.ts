import {SortDirection} from "mongodb";
import {BlogViewType, BlogsPaginatedViewType} from "./blog.type";
import BlogsQueryRepository from "./blogs-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export default class BlogsQueryService {
    constructor(@inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository) {}

    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        searchNameTerm: string | null
    ): Promise<BlogsPaginatedViewType> {

        const search = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            ...search
        }

        const blogs: BlogViewType[] = await this.blogsQueryRepository.getBlogs(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            filter)

        const blogsCount: number = await this.blogsQueryRepository.getBlogsCount(filter)

        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsCount,
            items: blogs
        }
    }
}