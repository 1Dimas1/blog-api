import {PostCreateByBlogIdDto, PostDto, PostInputDto} from "./post.test.type";

export function expectPostsEqual(actual: PostDto, expected: PostDto) {
    expect(actual.id).toBe(expected.id);
    expect(actual.title).toBe(expected.title);
    expect(actual.shortDescription).toBe(expected.shortDescription);
    expect(actual.content).toBe(expected.content);
    expect(actual.blogId).toBe(expected.blogId);
    expect(actual.blogName).toBe(expected.blogName);
    expect(actual.createdAt).toBe(expected.createdAt);
}

export function expectPostMatchesInput(post: PostDto, input: PostInputDto) {
    expect(post.title).toBe(input.title);
    expect(post.shortDescription).toBe(input.shortDescription);
    expect(post.content).toBe(input.content);
    expect(post.blogId).toBe(input.blogId);
}

export function expectPostMatchesCreateByBlogIdInput(post: PostDto, input: PostCreateByBlogIdDto) {
    expect(post.title).toBe(input.title);
    expect(post.shortDescription).toBe(input.shortDescription);
    expect(post.content).toBe(input.content);
}

export function expectValidPostShape(post: PostDto) {
    expect(typeof post.id).toBe('string');
    expect(typeof post.createdAt).toBe('string');
    const isValidDate = !isNaN(Date.parse(post.createdAt))
        && post.createdAt === new Date(post.createdAt).toISOString();
    expect(isValidDate).toBe(true);
}

export function expectValidationErrors(body: any, expectedFields: string[]) {
    expect(body.errorsMessages).toHaveLength(expectedFields.length);
    expectedFields.forEach((field, index) => {
        expect(body.errorsMessages[index].field).toBe(field);
    });
}