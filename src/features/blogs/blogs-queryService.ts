import {SortDirection} from "mongodb";
import {BlogViewModel, BlogsPaginator} from "./blog.type";
import {blogsQueryRepository} from "./blogs-queryRepository";

export const blogsQueryService = {
    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        searchNameTerm: string | null
    ): Promise<BlogsPaginator> {

        const search = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            ...search
        }

        const blogs: BlogViewModel[] = await blogsQueryRepository.getBlogs(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            filter)

        const blogsCount: number = await blogsQueryRepository.getBlogsCount(filter)

        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsCount,
            items: blogs
        }
    },
}