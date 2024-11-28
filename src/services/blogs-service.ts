import {SortDirection} from "mongodb";
import {BlogDBType, BlogOutPutType, BlogsPaginator} from "../types/blog.type";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsService = {
    async getBlogs(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        searchNameTerm: string | null
    ): Promise<BlogsPaginator> {

        const search = searchNameTerm
            ? {title: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            ...search
        }

        const blogs: BlogDBType[] = await blogsRepository.getBlogs(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            filter)

        const blogsCount: number = await blogsRepository.getBlogsCount(filter)

        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogsCount,
            items: blogs.map(blogsRepository.mapToOutput)
        }
    },
}