import {CommentPaginatedViewModel, CommentViewModel, QueryCommentType} from "./comment.type";
import {PostDBType} from "../posts/post.type";
import {postsRepository} from "../posts/posts-repository";
import {commentsQueryRepository} from "./comments-queryRepository";

export const commentsQueryService = {

    async getCommentsByPostId(
        postId: string,
        queryParams: QueryCommentType
    ): Promise<CommentPaginatedViewModel | null> {
        const post: PostDBType | null = await postsRepository.findPostById(postId);
        if (!post) return null;

        return commentsQueryRepository.getCommentsByPostId(postId, queryParams);
    },

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return commentsQueryRepository.getCommentById(id);
    }
}