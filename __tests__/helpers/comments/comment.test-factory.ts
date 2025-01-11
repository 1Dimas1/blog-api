import {CommentDto, CommentInputDto} from "./comment.test.type";
import {CommentTestRepository} from "./comment.test-repository";

export const commentTestFactory = {
    createCommentWithLength(length: number): CommentInputDto {
        return {
            content: 'a'.repeat(length)
        }
    },

    createValidCommentInputDto(): CommentInputDto {
        return {
            content: 'This is a valid comment with proper length.'
        }
    },

    async createComment(
        repository: CommentTestRepository,
        postId: string,
        token: string,
    ): Promise<CommentDto> {
        const response = await repository.createComment(
            postId,
            this.createValidCommentInputDto(),
            token
        );
        return response.body;
    },

    async createManyComments(
        repository: CommentTestRepository,
        postId: string,
        token: string,
        count: number
    ): Promise<CommentDto[]> {
        const comments: CommentDto[] = [];
        for(let i = 1; i <= count; i++) {
            const comment = await this.createComment(
                repository,
                postId,
                token,
            );
            comments.push(comment);
            // Add delay between creations for sorting tests
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return comments;
    }
}