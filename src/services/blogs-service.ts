import {DeleteResult, InsertOneResult, ObjectId, SortDirection, UpdateResult} from "mongodb";
import {BlogDBType, BlogInputType, BlogOutPutType, BlogsPaginator} from "../types/blog.type";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsService} from "./posts-service";
import {PostCreateByBlogIdInputType, PostInputType, PostOutPutType, PostsPaginator} from "../types/post.type";

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
    async findBlogById(id: string): Promise<BlogOutPutType | null> {
        const blog: BlogDBType | null = await blogsRepository.findBlogById(id)
        if (blog) {
            return blogsRepository.mapToOutput(blog)
        }
        return null;
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
        const result: InsertOneResult<BlogDBType> = await blogsRepository.createBlog(blog);
        return blogsRepository.mapToOutput(blog)
    },
    async createPostByBlogId(blogId: string, body: PostCreateByBlogIdInputType): Promise<PostOutPutType | null> {
        const bodyForPostCreation: PostInputType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
        }
        return await postsService.createPost(bodyForPostCreation)
    },
    async getPostsByBlogId(
        blogId: string,
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
    ): Promise<PostsPaginator> {

        const filter = {blogId: new ObjectId(blogId)}
        return await postsService.getPosts(sortBy, sortDirection, pageNumber, pageSize, filter);
    },
    async updateBlog(id: string, body: BlogInputType): Promise<UpdateResult<BlogDBType>> {
        const blog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
        return await blogsRepository.updateBlog(id, blog)
    },
    async deleteBlog(id: string): Promise<DeleteResult> {
        return await blogsRepository.deleteBlog(id)
    }
}