import {PostTestRepository} from "./helpers/posts/post.test-repository";
import {BlogTestRepository} from "./helpers/blogs/blog.test-repository";
import {BlogViewType} from "../src/features/blogs/blog.type";
import {createString, req} from "./helpers/test.helpers";
import {SETTINGS} from "../src/settings";
import {blogTestFactory} from "./helpers/blogs/blog.test-factory";
import {postTestFactory} from "./helpers/posts/post.test-factory";
import {
    expectPostMatchesCreateByBlogIdInput,
    expectPostMatchesInput,
    expectPostsEqual,
    expectValidationErrors,
    expectValidPostShape
} from "./helpers/posts/post.test-helpers";
import {PostDto, PostsResponse} from "./helpers/posts/post.test.type";
import {HTTP_CODES} from "../src/common/http.statuses";
import mongoose from "mongoose";

describe('/posts', () => {
    let postRepository: PostTestRepository;
    let blogRepository: BlogTestRepository;
    let blog: BlogViewType;

    beforeAll(async () => {

        await mongoose.connect(
            SETTINGS.MONGO_URL!, {
                dbName: SETTINGS.DB_NAME!
            }
        )})

    beforeEach(async () => {
        postRepository = new PostTestRepository(req);
        blogRepository = new BlogTestRepository(req);
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
        blog = await blogTestFactory.createBlog(blogRepository);
    });

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
        await mongoose.connection.close();
    });

    describe('GET /posts', () => {
        it('should return empty array when no posts exist', async () => {
            const response = await postRepository.getAllPosts();

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body.items).toHaveLength(0);
        });

        it('should return a newly created post', async () => {
            const post = await postTestFactory.createPost(postRepository, blog.id);
            const response = await postRepository.getAllPosts();

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body.items).toHaveLength(1);
            expectPostsEqual(response.body.items[0], post);
        });
    });

    describe('GET /posts pagination and sorting', () => {
        jest.setTimeout(10000);

        beforeEach(async () => {
            await postTestFactory.createMultiplePosts(15, postRepository, blog.id);
        });

        describe('pagination', () => {
            it('should return posts with default pagination (pageNumber=1, pageSize=10)', async () => {
                const response = await postRepository.getAllPosts();
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(10);
                expect(postsResponse.page).toBe(1);
                expect(postsResponse.pageSize).toBe(10);
                expect(postsResponse.totalCount).toBe(15);
                expect(postsResponse.pagesCount).toBe(2);
            });

            it('should return second page with custom pageSize', async () => {
                const response = await postRepository.getAllPosts({
                    pageNumber: 2,
                    pageSize: 5
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(5);
                expect(postsResponse.page).toBe(2);
                expect(postsResponse.pageSize).toBe(5);
                expect(postsResponse.totalCount).toBe(15);
                expect(postsResponse.pagesCount).toBe(3);
            });

            it('should return last page with remaining items', async () => {
                const response = await postRepository.getAllPosts({
                    pageNumber: 2,
                    pageSize: 10
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(5); // Remaining items
                expect(postsResponse.page).toBe(2);
                expect(postsResponse.totalCount).toBe(15);
            });

            it('should return empty array for page beyond total pages', async () => {
                const response = await postRepository.getAllPosts({
                    pageNumber: 4,
                    pageSize: 5
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(0);
                expect(postsResponse.totalCount).toBe(15);
            });
        });

        describe('sorting by time', () => {
            it('should return posts sorted by creation time ascending with clear time differences', async () => {
                const response = await postRepository.getAllPosts({
                    sortBy: 'createdAt',
                    sortDirection: 'asc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);

                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => a - b));

                // Verify time differences between posts
                for (let i = 1; i < dates.length; i++) {
                    const timeDiff = dates[i] - dates[i - 1];
                    expect(timeDiff).toBeGreaterThan(0);
                }
            });

            it('should return posts sorted by creation time descending with clear time differences', async () => {
                const response = await postRepository.getAllPosts({
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);

                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));

                // Verify time differences between posts
                for (let i = 1; i < dates.length; i++) {
                    const timeDiff = dates[i - 1] - dates[i];
                    expect(timeDiff).toBeGreaterThan(0);
                }
            });

            it('should maintain time order when paginating', async () => {
                const firstPage = await postRepository.getAllPosts({
                    pageNumber: 1,
                    pageSize: 5,
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const secondPage = await postRepository.getAllPosts({
                    pageNumber: 2,
                    pageSize: 5,
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });

                const firstPageDates = firstPage.body.items.map((post: PostDto) => new Date(post.createdAt).getTime());
                const secondPageDates = secondPage.body.items.map((post: PostDto) => new Date(post.createdAt).getTime());

                // Verify first page is newer than second page
                const oldestFirstPage = Math.min(...firstPageDates);
                const newestSecondPage = Math.max(...secondPageDates);
                expect(oldestFirstPage).toBeGreaterThan(newestSecondPage);
            });

            it('should handle multiple posts created at different times within the same second', async () => {
                // Create posts with minimal delay to test time resolution
                const quickPosts = await postTestFactory.createMultiplePosts(3, postRepository, blog.id, 10);

                const response = await postRepository.getAllPosts({
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const postsResponse: PostsResponse = response.body;

                const dates = postsResponse.items
                    .slice(0, 3)
                    .map(post => new Date(post.createdAt).getTime());

                // Verify posts are ordered even with small time differences
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
            });
        });

        describe('sorting', () => {
            it('should sort posts by createdAt in ascending order', async () => {
                const response = await postRepository.getAllPosts({
                    sortBy: 'createdAt',
                    sortDirection: 'asc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => a - b));
            });

            it('should sort posts by createdAt in descending order', async () => {
                const response = await postRepository.getAllPosts({
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
            });

            it('should apply default sorting (createdAt desc) when no sort parameters provided', async () => {
                const response = await postRepository.getAllPosts();
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
            });

            it('should sort by title in ascending order', async () => {
                const response = await postRepository.getAllPosts({
                    sortBy: 'title',
                    sortDirection: 'asc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                const titles = postsResponse.items.map(post => post.title);
                expect(titles).toEqual([...titles].sort());
            });
        });

        describe('combined pagination and sorting', () => {
            it('should return sorted page with custom size', async () => {
                const response = await postRepository.getAllPosts({
                    pageNumber: 2,
                    pageSize: 5,
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(5);
                expect(postsResponse.page).toBe(2);

                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
            });
        });

        describe('blog posts pagination', () => {
            it('should return paginated posts for specific blog', async () => {
                const response = await postRepository.getPostsByBlogId(blog.id, {
                    pageNumber: 2,
                    pageSize: 5
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(postsResponse.items).toHaveLength(5);
                expect(postsResponse.page).toBe(2);
                postsResponse.items.forEach(post => {
                    expect(post.blogId).toBe(blog.id);
                });
            });

            it('should sort blog posts by createdAt', async () => {
                const response = await postRepository.getPostsByBlogId(blog.id, {
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });
                const postsResponse: PostsResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                const dates = postsResponse.items.map(post => new Date(post.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
                postsResponse.items.forEach(post => {
                    expect(post.blogId).toBe(blog.id);
                });
            });

            it('should return 404 for non-existent blog posts with pagination', async () => {
                const response = await postRepository.getPostsByBlogId('647f76db548418d53ab66666', {
                    pageNumber: 1,
                    pageSize: 10
                });

                expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
            });
        });
    });

    describe('GET /posts/:id', () => {
        it('should return 404 for non-existent post', async () => {
            const response = await postRepository.getPostById('67462ce1b0650d27e4ecfcf6');
            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should return post by id', async () => {
            const post = await postTestFactory.createPost(postRepository, blog.id);
            const response = await postRepository.getPostById(post.id);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expectPostsEqual(response.body, post);
        });
    });

    describe('POST /posts', () => {
        it('should create post with valid input', async () => {
            const postInput = postTestFactory.createPostInputDto(blog.id);
            const response = await postRepository.createPost(postInput);

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expectPostMatchesInput(response.body, postInput);
            expectValidPostShape(response.body);
        });

        it('should not create post without authorization', async () => {
            const postInput = postTestFactory.createPostInputDto(blog.id);
            const response = await postRepository.createPost(postInput, false);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
            const posts = await postRepository.getAllPosts();
            expect(posts.body.items).toHaveLength(0);
        });

        it('should not create post with invalid input', async () => {
            const invalidPost = postTestFactory.createInvalidPostInputDto(blog.id);
            const response = await postRepository.createPost(invalidPost);

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expectValidationErrors(response.body, ['title', 'shortDescription', 'content']);
        });
    });

    describe('POST /blogs/:blogId/posts', () => {
        it('should create post for blog', async () => {
            const postInput = postTestFactory.createPostByBlogIdDto();
            const response = await postRepository.createPostByBlogId(blog.id, postInput);

            console.log(response.body)

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expect(response.body.blogId).toBe(blog.id);
            expect(response.body.blogName).toBe(blog.name);
            expectPostMatchesCreateByBlogIdInput(response.body, postInput);
        });

        it('should not create post for non-existent blog', async () => {
            const postInput = postTestFactory.createPostByBlogIdDto();
            const response = await postRepository.createPostByBlogId('67462ce1b0650d27e4ecfcf6', postInput);

            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });
    });

    describe('PUT /posts/:id', () => {
        it('should update post', async () => {
            const post = await postTestFactory.createPost(postRepository, blog.id);
            const updateInput = postTestFactory.createPostInputDto(blog.id);

            const response = await postRepository.updatePost(post.id, updateInput);
            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);

            const updatedPost = await postRepository.getPostById(post.id);
            expectPostMatchesInput(updatedPost.body, updateInput);
        });

        it('should not update non-existent post', async () => {
            const updateInput = postTestFactory.createPostInputDto(blog.id);
            const response = await postRepository.updatePost('67462ce1b0650d27e4ecfcf6', updateInput);
            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should not update post without authorization', async () => {
            const post = await postTestFactory.createPost(postRepository, blog.id);
            const updateInput = postTestFactory.createPostInputDto(blog.id);

            const response = await postRepository.updatePost(post.id, updateInput, false);
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);

            const unchangedPost = await postRepository.getPostById(post.id);
            expectPostsEqual(unchangedPost.body, post);
        });

        describe('input validation', () => {
            let post: PostDto;

            beforeEach(async () => {
                post = await postTestFactory.createPost(postRepository, blog.id);
            });

            it('should return 400 with validation errors when all fields are invalid', async () => {
                const invalidInput = {
                    title: createString(31),
                    shortDescription: createString(101),
                    content: createString(1001),
                    blogId: '647f76db548418d53ab66666'
                };

                const response = await postRepository.updatePost(post.id, invalidInput);

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(4);
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'title'
                });
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'shortDescription'
                });
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'content'
                });
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'blogId'
                });

                const unchangedPost = await postRepository.getPostById(post.id);
                expectPostsEqual(unchangedPost.body, post);
            });

            it('should return 400 when title is invalid', async () => {
                const response = await postRepository.updatePost(post.id, {
                    ...postTestFactory.createPostInputDto(blog.id),
                    title: createString(31)
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('title');
            });

            it('should return 400 when shortDescription is invalid', async () => {
                const response = await postRepository.updatePost(post.id, {
                    ...postTestFactory.createPostInputDto(blog.id),
                    shortDescription: createString(101)
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('shortDescription');
            });

            it('should return 400 when content is invalid', async () => {
                const response = await postRepository.updatePost(post.id, {
                    ...postTestFactory.createPostInputDto(blog.id),
                    content: createString(1001)
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('content');
            });

            it('should return 400 when blogId is invalid', async () => {
                const response = await postRepository.updatePost(post.id, {
                    ...postTestFactory.createPostInputDto(blog.id),
                    blogId: '647f76db548418d53ab66666'
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('blogId');
            });
        });
    });

    describe('DELETE /posts/:id', () => {
        it('should delete post', async () => {
            const post = await postTestFactory.createPost(postRepository, blog.id);

            const response = await postRepository.deletePost(post.id);
            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);

            const posts = await postRepository.getAllPosts();
            expect(posts.body.items).toHaveLength(0);
        });

        it('should not delete non-existent post', async () => {
            const response = await postRepository.deletePost('67462ce1b0650d27e4ecfcf6');
            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });
    });
});