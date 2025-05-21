import {ObjectId, SortDirection} from "mongodb";
import {PostViewType, PostsPaginatedViewType} from "./post.type";
import PostsQueryRepository from "./posts-query-repository";
import {inject, injectable} from "inversify";
import mongoose from "mongoose";

@injectable()
export default class PostsQueryService {
    constructor(@inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository) {}

    async getPosts(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        blogId: string | null = null,
    ): Promise<PostsPaginatedViewType> {
        const search = blogId
            ? {blogId: new mongoose.Types.ObjectId(blogId)}
            : {}
        const filter = {
            ...search
        }
        const posts: PostViewType[] = await this.postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize, filter)
        const postsCount: number = await this.postsQueryRepository.getPostsCount(filter)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts
        }
    }
}