import {HTTP_CODES, SETTINGS} from "../src/settings";
import {BlogTestRepository} from "./helpers/blogs/blog.test-repository";
import {createString, req} from "./helpers/test.helpers";
import {blogTestFactory} from "./helpers/blogs/blog.test-factory";
import {
    createTestBlog,
    expectBlogsToMatch,
    expectBlogToMatchInput,
    expectValidationErrors,
    expectValidBlogShape
} from "./helpers/blogs/blog.test-helpers";
import {BlogsResponse} from "./helpers/blogs/blog.test.type";
import {BlogViewModel} from "../src/features/blogs/blog.type";

describe('/blogs', () => {
    let blogRepository: BlogTestRepository;

    beforeEach(async () => {
        blogRepository = new BlogTestRepository(req);
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)
    })

    describe('GET /blogs', () => {
        it('should return empty array when no blogs exist', async () => {
            const res = await blogRepository.getAllBlogs()

            expect(res.status).toBe(HTTP_CODES.OK_200)
            expect(res.body.items).toHaveLength(0)
        })

        it('should return newly created blog', async () => {
            const blogInput = blogTestFactory.createBlogInputDto()

            const createRes = await blogRepository.createBlog(blogInput)
            const getRes = await blogRepository.getAllBlogs()

            expect(getRes.status).toBe(HTTP_CODES.OK_200)
            expect(getRes.body.items).toHaveLength(1)
            expectBlogsToMatch(getRes.body.items[0], createRes.body)
        })

        describe('search and pagination', () => {
            beforeEach(async () => {
                await blogTestFactory.createMultipleBlogs(5, blogRepository);
            });

            describe('search functionality', () => {
                it('should search blogs by name term', async () => {
                    const res = await blogRepository.getAllBlogs({ searchNameTerm: 'Blog 1' });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items.length).toBe(1);
                    expect(blogsResponse.items[0].name).toContain('Blog 1');
                });

                it('should return empty array when search term matches no blogs', async () => {
                    const res = await blogRepository.getAllBlogs({ searchNameTerm: 'NonexistentBlog' });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items).toHaveLength(0);
                    expect(blogsResponse.totalCount).toBe(0);
                });

                it('should handle case-insensitive search', async () => {
                    const res = await blogRepository.getAllBlogs({ searchNameTerm: 'blog' });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items.length).toBe(5);
                    blogsResponse.items.forEach(blog => {
                        expect(blog.name.toLowerCase()).toContain('blog');
                    });
                });
            });

            describe('pagination', () => {
                it('should return paginated results', async () => {
                    const res = await blogRepository.getAllBlogs({
                        pageNumber: 2,
                        pageSize: 2
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items.length).toBe(2);
                    expect(blogsResponse.page).toBe(2);
                    expect(blogsResponse.pageSize).toBe(2);
                    expect(blogsResponse.totalCount).toBe(5);
                    expect(blogsResponse.pagesCount).toBe(3);
                });

                it('should return first page with default pageSize when no pagination params provided', async () => {
                    const res = await blogRepository.getAllBlogs({});
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.page).toBe(1);
                    expect(blogsResponse.pageSize).toBe(10);
                    expect(blogsResponse.items.length).toBe(5);
                });

                it('should return empty array for page beyond available data', async () => {
                    const res = await blogRepository.getAllBlogs({
                        pageNumber: 10,
                        pageSize: 2
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items).toHaveLength(0);
                    expect(blogsResponse.totalCount).toBe(5);
                });
            });

            describe('sorting', () => {
                it('should sort blogs by createdAt in ascending order', async () => {
                    const res = await blogRepository.getAllBlogs({
                        sortBy: 'createdAt',
                        sortDirection: 'asc'
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    const dates = blogsResponse.items.map(blog => new Date(blog.createdAt).getTime());
                    expect(dates).toEqual([...dates].sort((a, b) => a - b));
                });

                it('should sort blogs by createdAt in descending order', async () => {
                    const res = await blogRepository.getAllBlogs({
                        sortBy: 'createdAt',
                        sortDirection: 'desc'
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    const dates = blogsResponse.items.map(blog => new Date(blog.createdAt).getTime());
                    expect(dates).toEqual([...dates].sort((a, b) => b - a));
                });

                it('should sort by name field', async () => {
                    const res = await blogRepository.getAllBlogs({
                        sortBy: 'name',
                        sortDirection: 'asc'
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    const names = blogsResponse.items.map(blog => blog.name);
                    expect(names).toEqual([...names].sort());
                });
            });

            describe('combined functionality', () => {
                it('should handle search with pagination', async () => {
                    const res = await blogRepository.getAllBlogs({
                        searchNameTerm: 'Blog',
                        pageNumber: 2,
                        pageSize: 2,
                        sortBy: 'createdAt',
                        sortDirection: 'desc'
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items.length).toBeLessThanOrEqual(2);
                    expect(blogsResponse.page).toBe(2);
                    expect(blogsResponse.items.every(blog => blog.name.includes('Blog'))).toBe(true);

                    const dates = blogsResponse.items.map(blog => new Date(blog.createdAt).getTime());
                    expect(dates).toEqual([...dates].sort((a, b) => b - a));
                });

                it('should handle empty search result with valid pagination', async () => {
                    const res = await blogRepository.getAllBlogs({
                        searchNameTerm: 'NonexistentBlog',
                        pageNumber: 1,
                        pageSize: 10
                    });
                    const blogsResponse: BlogsResponse = res.body;

                    expect(res.status).toBe(HTTP_CODES.OK_200);
                    expect(blogsResponse.items).toHaveLength(0);
                    expect(blogsResponse.totalCount).toBe(0);
                    expect(blogsResponse.pagesCount).toBe(0);
                    expect(blogsResponse.page).toBe(1);
                    expect(blogsResponse.pageSize).toBe(10);
                });
            });
        });
    });

    describe('Blog Posts', () => {
        it('should get posts for a specific blog', async () => {
            const blog = await createTestBlog();
            const post = {
                title: 'Test Post',
                shortDescription: 'Test Description',
                content: 'Test Content'
            };

            await blogRepository.createPostForBlog(blog.id, post);
            const res = await blogRepository.getPostsForBlog(blog.id);

            expect(res.status).toBe(HTTP_CODES.OK_200);
            expect(res.body.items.length).toBe(1);
            expect(res.body.items[0].title).toBe(post.title);
        });

        it('should paginate blog posts', async () => {
            const blog = await createTestBlog();
            const posts = Array.from({ length: 5 }, (_, i) => ({
                title: `Post ${i + 1}`,
                shortDescription: `Description ${i + 1}`,
                content: `Content ${i + 1}`
            }));

            for (const post of posts) {
                await blogRepository.createPostForBlog(blog.id, post);
            }

            const res = await blogRepository.getPostsForBlog(blog.id, {
                pageNumber: 2,
                pageSize: 2
            });

            expect(res.status).toBe(HTTP_CODES.OK_200);
            expect(res.body.items.length).toBe(2);
            expect(res.body.page).toBe(2);
            expect(res.body.pageSize).toBe(2);
        });

        it('should return 404 when getting posts for non-existent blog', async () => {
            const res = await blogRepository.getPostsForBlog('67462ce1b0650d27e4ecfcf6');
            expect(res.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should create post for blog', async () => {
            const blog = await createTestBlog();
            const post = {
                title: 'Test Post',
                shortDescription: 'Test Description',
                content: 'Test Content'
            };

            const res = await blogRepository.createPostForBlog(blog.id, post);

            expect(res.status).toBe(HTTP_CODES.CREATED_201);
            expect(res.body.title).toBe(post.title);
            expect(res.body.blogId).toBe(blog.id);
            expect(res.body.blogName).toBe(blog.name);
        });

        it('should return 401 when creating post without authorization', async () => {
            const blog = await createTestBlog();
            const post = {
                title: 'Test Post',
                shortDescription: 'Test Description',
                content: 'Test Content'
            };

            const res = await blogRepository.createPostForBlog(blog.id, post, false);
            expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 404 when creating post for non-existent blog', async () => {
            const post = {
                title: 'Test Post',
                shortDescription: 'Test Description',
                content: 'Test Content'
            };

            const res = await blogRepository.createPostForBlog('67462ce1b0650d27e4ecfcf6', post);
            expect(res.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });
    });

    describe('GET /blogs/:id', () => {
        it('should return 404 for non-existent blog', async () => {
            const res = await blogRepository.getBlogById('67462ce1b0650d27e4ecfcf6')

            expect(res.status).toBe(HTTP_CODES.NOT_FOUND_404)
        })

        it('should return blog by id', async () => {
            const blogInput = blogTestFactory.createBlogInputDto()

            const createRes = await blogRepository.createBlog(blogInput)
            const getRes = await blogRepository.getBlogById(createRes.body.id)

            expect(getRes.status).toBe(HTTP_CODES.OK_200)
            expectBlogsToMatch(getRes.body, createRes.body)
        })
    });

    describe('POST /blogs', () => {
        it('should create blog with valid input', async () => {
            const blogInput = blogTestFactory.createBlogInputDto()

            const res = await blogRepository.createBlog(blogInput)

            expect(res.status).toBe(HTTP_CODES.CREATED_201)
            expectBlogToMatchInput(res.body, blogInput)
            expectValidBlogShape(res.body)
        })

        it('should return 401 without authentication', async () => {
            const blogInput = blogTestFactory.createBlogInputDto()

            const res = await blogRepository.createBlog(blogInput, false)

            expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED_401)
            const blogs = await blogRepository.getAllBlogs()
            expect(blogs.body.items).toHaveLength(0)
        })

        it('should return 400 for invalid input', async () => {
            const invalidBlog = blogTestFactory.createInvalidBlogInputDto()

            const res = await blogRepository.createBlog(invalidBlog)

            expect(res.status).toBe(HTTP_CODES.BAD_REQUEST_400)
            expectValidationErrors(res.body, ['name', 'description', 'websiteUrl'])
        })
    });

    describe('PUT /blogs/:id', () => {
        it('should update blog with valid input', async () => {
            const blog = await createTestBlog();
            const updateDto = blogTestFactory.createBlogInputDto({
                name: 'name updated',
                description: 'blog description updated',
                websiteUrl: 'http://someUrlUpdated.com',
            });

            const updateRes = await blogRepository.updateBlog(blog.id, updateDto);

            expect(updateRes.status).toBe(HTTP_CODES.NO_CONTENT_204);
            const getRes = await blogRepository.getAllBlogs();
            expectBlogToMatchInput(getRes.body.items[0], updateDto);
        });

        it('should return 404 for non-existent blog', async () => {
            const updateDto = blogTestFactory.createBlogInputDto();

            const res = await blogRepository.updateBlog('67462ce1b0650d27e4ecfcf6', updateDto);

            expect(res.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should return 401 without authentication', async () => {
            const blog = await createTestBlog();
            const updateDto = blogTestFactory.createBlogInputDto();

            const res = await blogRepository.updateBlog(blog.id, updateDto, false);

            expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
            const getRes = await blogRepository.getAllBlogs();
            expectBlogsToMatch(getRes.body.items[0], blog);
        });

        describe('input validation', () => {
            let blog: BlogViewModel;

            beforeEach(async () => {
                blog = await createTestBlog();
            });

            it('should return 400 when all fields are invalid', async () => {
                const invalidInput = {
                    name: createString(16),
                    description: createString(501),
                    websiteUrl: 'invalid-url'
                };

                const response = await blogRepository.updateBlog(blog.id, invalidInput);

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(3);
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'name'
                });
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'description'
                });
                expect(response.body.errorsMessages).toContainEqual({
                    message: expect.any(String),
                    field: 'websiteUrl'
                });

                const getRes = await blogRepository.getAllBlogs();
                expectBlogsToMatch(getRes.body.items[0], blog);
            });

            it('should return 400 when name is too long', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    name: createString(16)
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('name');
            });

            it('should return 400 when name is empty', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    name: ''
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('name');
            });

            it('should return 400 when description is too long', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    description: createString(501)
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('description');
            });

            it('should return 400 when description is empty', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    description: ''
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('description');
            });

            it('should return 400 when websiteUrl is invalid', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    websiteUrl: 'invalid-url'
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('websiteUrl');
            });

            it('should return 400 when websiteUrl is empty', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    websiteUrl: ''
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('websiteUrl');
            });

            it('should return 400 when websiteUrl exceeds maximum length', async () => {
                const response = await blogRepository.updateBlog(blog.id, {
                    ...blogTestFactory.createBlogInputDto(),
                    websiteUrl: `http://${createString(100)}.com`
                });

                expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
                expect(response.body.errorsMessages).toHaveLength(1);
                expect(response.body.errorsMessages[0].field).toBe('websiteUrl');
            });
        });
    });

    describe('DELETE /blogs/:id', () => {
        it('should delete existing blog', async () => {
            const blog = await createTestBlog()

            const deleteRes = await blogRepository.deleteBlog(blog.id)

            expect(deleteRes.status).toBe(HTTP_CODES.NO_CONTENT_204)
            const getRes = await blogRepository.getAllBlogs()
            expect(getRes.body.items).toHaveLength(0)
        })

        it('should return 404 for non-existent blog', async () => {
            const res = await blogRepository.deleteBlog('67462ce1b0650d27e4ecfcf6')

            expect(res.status).toBe(HTTP_CODES.NOT_FOUND_404)
        })

        it('should return 401 without authentication', async () => {
            const blog = await createTestBlog()

            const res = await blogRepository.deleteBlog(blog.id, false)

            expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED_401)
            const getRes = await blogRepository.getAllBlogs()
            expect(getRes.body.items).toHaveLength(1)
        })
    });
})