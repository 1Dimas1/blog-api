import {CommentPaginatedViewType, CommentViewType, QueryCommentType} from "./comment.type";
import {PostDocument} from "../posts/post.type";
import PostsRepository from "../posts/posts-repository";
import CommentsQueryRepository from "./comments-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export default class CommentsQueryService {
    constructor(
        @inject(CommentsQueryRepository)
        private commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsRepository)
        private postsRepository: PostsRepository,
    ) {}

    async getCommentsByPostId(
        postId: string,
        queryParams: QueryCommentType
    ): Promise<CommentPaginatedViewType | null> {
        const post: PostDocument | null = await this.postsRepository.findPostById(postId);
        if (!post) return null;

        return this.commentsQueryRepository.getCommentsByPostId(postId, queryParams);
    }

    async getCommentById(id: string): Promise<CommentViewType | null> {
        return this.commentsQueryRepository.getCommentById(id);
    }
}