import {CommentPaginatedViewType, CommentViewType} from "./comment.type";
import {PostDocument} from "../posts/post.type";
import PostsRepository from "../posts/posts-repository";
import CommentsQueryRepository from "./comments-query-repository";
import {inject, injectable} from "inversify";
import {SortDirection} from "mongodb";

@injectable()
export default class CommentsQueryService {
    constructor(
        @inject(CommentsQueryRepository)
        private commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
    ) {}

    async getPostsComments(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: SortDirection,
        userId: string | null
    ): Promise<CommentPaginatedViewType | null> {
        const post: PostDocument | null = await this.postsRepository.findPostById(postId);
        if (!post) return null;

        return this.commentsQueryRepository.getPostsComments(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            userId
        );
    }

    async getComment(id: string, userId: string | null): Promise<CommentViewType | null> {
        return this.commentsQueryRepository.getComment(id, userId);
    }
}