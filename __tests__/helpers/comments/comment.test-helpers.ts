import {UserDto} from "../users/user.test.type";
import {BlogDto} from "../blogs/blog.test.type";
import {PostDto} from "../posts/post.test.type";
import {UserTestRepository} from "../users/user.test-repository";
import {AuthTestRepository} from "../auth/auth.test-repository";
import {PostTestRepository} from "../posts/post.test-repository";
import {req} from "../test.helpers";
import {SETTINGS} from "../../../src/settings";
import {HTTP_CODES} from "../../../src/common/http.statuses";
import {createTestBlog} from "../blogs/blog.test-helpers";
import {postTestFactory} from "../posts/post.test-factory";
import {CommentDto, CommentInputDto} from "./comment.test.type";

export type TestContext = {
    user: UserDto
    accessToken: string
    blog: BlogDto
    post: PostDto
}

export async function setupTest(): Promise<TestContext> {
    const userRepository = new UserTestRepository(req);
    const authRepository = new AuthTestRepository(req);
    const postRepository = new PostTestRepository(req);

    await req.delete(SETTINGS.PATH.TESTING.concat('/all-data'))
        .expect(HTTP_CODES.NO_CONTENT_204);

    const user = await userRepository.createUser({
        login: 'testuser',
        password: 'password123',
        email: 'test@example.com'
    });

    const loginResponse = await authRepository.login({
        loginOrEmail: 'testuser',
        password: 'password123'
    });

    const blog: BlogDto = await createTestBlog();
    const post: PostDto = await postTestFactory.createPost(postRepository, blog.id);

    return {
        user: user.body,
        accessToken: loginResponse.body.accessToken,
        blog,
        post
    };
}

export async function createUserAndGetToken(prefix: string = ''): Promise<string> {
    const userRepository = new UserTestRepository(req);
    const authRepository = new AuthTestRepository(req);

    await userRepository.createUser({
        login: `${prefix}user`,
        password: 'password123',
        email: `${prefix}@example.com`
    });

    const loginResponse = await authRepository.login({
        loginOrEmail: `${prefix}user`,
        password: 'password123'
    });

    return loginResponse.body.accessToken;
}

export function expectCommentStructure(comment: CommentDto) {
    expect(comment).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
            userId: expect.any(String),
            userLogin: expect.any(String)
        },
        createdAt: expect.any(String)
    });
}

export function expectExactCommentData(responseComment: CommentDto, originalComment: CommentDto) {
    expect(responseComment).toEqual({
        id: originalComment.id,
        content: originalComment.content,
        commentatorInfo: {
            userId: originalComment.commentatorInfo.userId,
            userLogin: originalComment.commentatorInfo.userLogin
        },
        createdAt: originalComment.createdAt
    });
}

export function expectCommentDataStructure(comment: CommentDto) {
    expect(comment).toEqual({
        id: expect.any(String),
        content: expect.any(String),
        commentatorInfo: {
            userId: expect.any(String),
            userLogin: expect.any(String)
        },
        createdAt: expect.any(String)
    });

    expect(new Date(comment.createdAt).toISOString()).toBe(comment.createdAt);
}

export function expectCommentToMatchInput(
    comment: CommentDto,
    input: CommentInputDto,
    userLogin: string
): void {
    expect(comment).toEqual({
        id: expect.any(String),
        content: input.content,
        commentatorInfo: {
            userId: expect.any(String),
            userLogin: userLogin
        },
        createdAt: expect.any(String)
    });

    expect(comment.content).toBe(input.content);
    expect(comment.commentatorInfo.userLogin).toBe(userLogin);

    const createdAtDate = new Date(comment.createdAt);
    expect(createdAtDate.toISOString()).toBe(comment.createdAt);
}

export function getNonExistentCommentId(): string {
    return '647f76db548418d53ab66666';
}