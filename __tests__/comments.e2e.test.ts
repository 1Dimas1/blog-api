import {
    createUserAndGetToken, expectCommentDataStructure,
    expectCommentStructure, expectCommentToMatchInput, expectExactCommentData, getNonExistentCommentId,
    setupTest,
    TestContext
} from "./helpers/comments/comment.test-helpers";
import {CommentTestRepository} from "./helpers/comments/comment.test-repository";
import {req} from "./helpers/test.helpers";
import {HTTP_CODES} from "../src/common/http.statuses";
import {CommentDto, CommentInputDto} from "./helpers/comments/comment.test.type";
import {commentTestFactory} from "./helpers/comments/comment.test-factory";

describe('Comments', () => {
    let testContext: TestContext;
    let commentRepository: CommentTestRepository;

    beforeEach(async () => {
        commentRepository = new CommentTestRepository(req);
        testContext = await setupTest();
    });

    describe('GET /posts/{postId}/comments', () => {
        it('should return empty array when no comments exist', async () => {
            const response  = await commentRepository.getComments(testContext.post.id);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body.items).toHaveLength(0);
        });

        describe('pagination and sorting', () => {
            let comments: CommentDto[];

            beforeEach(async () => {
                comments = await commentTestFactory.createManyComments(
                    commentRepository,
                    testContext.post.id,
                    testContext.accessToken,
                    5
                );
            });

            it('should return comments with default pagination', async () => {
                const response = await commentRepository.getComments(testContext.post.id);

                expect(response.body.items).toHaveLength(5);
                expect(response.body.page).toBe(1);
                expect(response.body.pageSize).toBe(10);
            });

            it('should sort comments by createdAt', async () => {
                const response = await commentRepository.getComments(testContext.post.id, {
                    sortBy: 'createdAt',
                    sortDirection: 'asc'
                });
                const dates = response.body.items.map((comment: CommentDto) => comment.createdAt);
                expect(dates).toEqual([...dates].sort());
            });
        });
    });

    describe('POST /posts/{postId}/comments', () => {
        it('should create comment with valid input', async () => {
            const newComment: CommentInputDto = commentTestFactory.createValidCommentInputDto();
            const response = await commentRepository.createComment(
                testContext.post.id,
                newComment,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectCommentStructure(response.body);
            expect(response.body.content).toBe(newComment.content);
        });

        it('should return 401 without token', async () => {
            const response = await commentRepository.createComment(
                testContext.post.id,
                commentTestFactory.createValidCommentInputDto(),
                ''
            );

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 400 with empty content', async () => {
            const response = await commentRepository.createComment(
                testContext.post.id,
                { content: '' },
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
        });
        it('should return 400 when content is less than 20 characters', async () => {
            const shortContent = commentTestFactory.createCommentWithLength(19);

            const response = await commentRepository.createComment(
                testContext.post.id,
                shortContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toEqual([{
                message: expect.any(String),
                field: 'content'
            }]);
        });
        it('should return 400 when content is more than 300 characters', async () => {
            const longContent = commentTestFactory.createCommentWithLength(301);

            const response = await commentRepository.createComment(
                testContext.post.id,
                longContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toEqual([{
                message: expect.any(String),
                field: 'content'
            }]);
        });
        it('should accept content exactly 20 characters', async () => {
            const minContent = commentTestFactory.createCommentWithLength(20);

            const response = await commentRepository.createComment(
                testContext.post.id,
                minContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectCommentToMatchInput(response.body, minContent, 'testuser');
        });

        it('should accept content exactly 300 characters', async () => {
            const maxContent = commentTestFactory.createCommentWithLength(300);

            const response = await commentRepository.createComment(
                testContext.post.id,
                maxContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectCommentToMatchInput(response.body, maxContent, 'testuser');
        });

        it('should accept content with length between 20 and 300 characters', async () => {
            const validContent = {
                content: 'This is a valid comment that should be accepted by the API because its length is within the allowed range.'
            };

            const response = await commentRepository.createComment(
                testContext.post.id,
                validContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectCommentToMatchInput(response.body, validContent, 'testuser');
        });
    });

    describe('GET /comments/:id', () => {
        let comment: CommentDto;

        beforeEach(async () => {
            comment = await commentTestFactory.createComment(
                commentRepository,
                testContext.post.id,
                testContext.accessToken
            );
        });

        it('should return comment by id', async () => {
            const response = await commentRepository.getCommentById(comment.id);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expectExactCommentData(response.body, comment);
        });

        it('should return 404 for non-existent comment id', async () => {
            const response = await commentRepository.getCommentById(getNonExistentCommentId());

            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should return exact comment data structure', async () => {
            const response = await commentRepository.getCommentById(comment.id);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expectCommentDataStructure(response.body);
        });
    });

    describe('PUT /comments/{id}', () => {
        let comment: CommentDto;

        beforeEach(async () => {
            comment = await commentTestFactory.createComment(
                commentRepository,
                testContext.post.id,
                testContext.accessToken
            );
        });

        it('should update own comment', async () => {
            const response = await commentRepository.updateComment(
                comment.id,
                { content: 'Updated' + commentTestFactory.createValidCommentInputDto() },
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
        });

        it('should return 403 when updating someone else\'s comment', async () => {
            const otherUserToken = await createUserAndGetToken('other');

            const response = await commentRepository.updateComment(
                comment.id,
                { content: 'Updated' + commentTestFactory.createValidCommentInputDto() },
                otherUserToken
            );

            expect(response.status).toBe(HTTP_CODES.FORBIDDEN_403);
        });

        it('should return 401 without token', async () => {
            const response = await commentRepository.updateComment(
                comment.id,
                { content: 'Updated' + commentTestFactory.createValidCommentInputDto() },
                ''
            );

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 400 when updating with content less than 20 characters', async () => {
            const shortContent = commentTestFactory.createCommentWithLength(19);

            const response = await commentRepository.updateComment(
                comment.id,
                shortContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toEqual([{
                message: expect.any(String),
                field: 'content'
            }]);
        });

        it('should return 400 when updating with content more than 300 characters', async () => {
            const longContent = commentTestFactory.createCommentWithLength(301);

            const response = await commentRepository.updateComment(
                comment.id,
                longContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toEqual([{
                message: expect.any(String),
                field: 'content'
            }]);
        });

        it('should accept update with content exactly 20 characters', async () => {
            const minContent = commentTestFactory.createCommentWithLength(20);

            const response = await commentRepository.updateComment(
                comment.id,
                minContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);


            const updatedComment = await commentRepository.getCommentById(comment.id);
            expect(updatedComment.body.content).toBe(minContent.content);
        });

        it('should accept update with content exactly 300 characters', async () => {
            const maxContent = commentTestFactory.createCommentWithLength(300);

            const response = await commentRepository.updateComment(
                comment.id,
                maxContent,
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);

            const updatedComment = await commentRepository.getCommentById(comment.id);
            expect(updatedComment.body.content).toBe(maxContent.content);
        });
    });

    describe('DELETE /comments/{id}', () => {
        let comment: CommentDto;

        beforeEach(async () => {
            comment = await commentTestFactory.createComment(
                commentRepository,
                testContext.post.id,
                testContext.accessToken
            );
        });

        it('should delete own comment', async () => {
            const response = await commentRepository.deleteComment(comment.id, testContext.accessToken);
            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
        });

        it('should return 403 when deleting someone else\'s comment', async () => {
            const otherUserToken = await createUserAndGetToken('other');

            const response = await commentRepository.deleteComment(comment.id, otherUserToken);
            expect(response.status).toBe(HTTP_CODES.FORBIDDEN_403);
        });

        it('should return 401 without token', async () => {
            const response = await commentRepository.deleteComment(comment.id, '');
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });
    });
});