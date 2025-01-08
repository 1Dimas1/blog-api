import {
    createUserAndGetToken, expectCommentDataStructure,
    expectCommentStructure, expectExactCommentData, getNonExistentCommentId,
    setupTest,
    TestContext
} from "./helpers/comments/comment.test-helpers";
import {CommentTestRepository} from "./helpers/comments/comment.test-repository";
import {req} from "./helpers/test.helpers";
import {HTTP_CODES} from "../src/common/http.statuses";
import {CommentDto} from "./helpers/comments/comment.test.type";
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
            const response = await commentRepository.createComment(
                testContext.post.id,
                commentTestFactory.createCommentInput(),
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectCommentStructure(response.body);
            expect(response.body.content).toBe('Test comment');
        });

        it('should return 401 without token', async () => {
            const response = await commentRepository.createComment(
                testContext.post.id,
                commentTestFactory.createCommentInput(),
                ''
            );

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 400 with invalid content', async () => {
            const response = await commentRepository.createComment(
                testContext.post.id,
                { content: '' },
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
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
                { content: 'Updated comment' },
                testContext.accessToken
            );

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
        });

        it('should return 403 when updating someone else\'s comment', async () => {
            const otherUserToken = await createUserAndGetToken('other');

            const response = await commentRepository.updateComment(
                comment.id,
                { content: 'Updated comment' },
                otherUserToken
            );

            expect(response.status).toBe(HTTP_CODES.FORBIDDEN_403);
        });

        it('should return 401 without token', async () => {
            const response = await commentRepository.updateComment(
                comment.id,
                { content: 'Updated comment' },
                ''
            );

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
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