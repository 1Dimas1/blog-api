import {ObjectId, SortDirection} from "mongodb";
import {PostViewType, PostsPaginatedViewModel} from "./post.type";
import {postsQueryRepository} from "./posts-queryRepository";

export const postsQueryService = {
    async getPosts(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        blogId: string | null = null,
    ): Promise<PostsPaginatedViewModel> {
        const search = blogId
            ? {blogId: new ObjectId(blogId)}
            : {}
        const filter = {
            ...search
        }
        const posts: PostViewType[] = await postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize, filter)
        const postsCount: number = await postsQueryRepository.getPostsCount(filter)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts
        }
    },
}