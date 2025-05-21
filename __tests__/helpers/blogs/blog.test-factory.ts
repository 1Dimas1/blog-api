import {BlogDto, BlogInputDto} from "./blog.test.type";
import {createString} from "../test.helpers";
import {BlogTestRepository} from "./blog.test-repository";

export const blogTestFactory = {
    createBlogInputDto(params: Partial<BlogInputDto> = {}): BlogInputDto {
        return {
            name: params.name ?? 'blog name',
            description: params.description ?? 'blog description',
            websiteUrl: params.websiteUrl ?? 'https://someValidUrl.com',
        }
    },

    createInvalidBlogInputDto(): BlogInputDto {
        return {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)
        }
    },

    async createBlog(repository: BlogTestRepository): Promise<BlogDto> {
        const blogInput = this.createBlogInputDto();
        const response = await repository.createBlog(blogInput);
        return response.body;
    },

    async createMultipleBlogs(count: number, repository: BlogTestRepository): Promise<BlogDto[]> {
        const blogs: BlogDto[] = [];
        for (let i = 0; i < count; i++) {
            const blog = await repository.createBlog(
                this.createBlogInputDto({
                    name: `Blog ${i + 1}`,
                    description: `Description ${i + 1}`,
                    websiteUrl: `https://blog${i + 1}.com`
                })
            );
            blogs.push(blog.body);
        }
        return blogs;
    }
}