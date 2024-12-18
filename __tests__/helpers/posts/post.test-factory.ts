import {PostCreateByBlogIdDto, PostDto, PostInputDto} from "./post.test.type";
import {createString} from "../test.helpers";
import {PostTestRepository} from "./post.test-repository";

export const postTestFactory = {
    createPostInputDto(blogId: string): PostInputDto {
        return {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId
        }
    },

    createPostByBlogIdDto(): PostCreateByBlogIdDto {
        return {
            title: 'title',
            content: 'content',
            shortDescription: 'short description'
        }
    },

    createInvalidPostInputDto(blogId: string): PostInputDto {
        return {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId
        }
    },

    async createPost(repository: PostTestRepository, blogId: string): Promise<PostDto> {
        const postInput = this.createPostInputDto(blogId);
        const response = await repository.createPost(postInput);
        return response.body;
    },

    async createMultiplePosts(count: number, repository: PostTestRepository, blogId: string, delayMs: number = 10): Promise<PostDto[]> {
        const posts: PostDto[] = [];

        for (let i = 1; i <= count; i++) {
            const postInput = {
                title: `Post ${i}`,
                shortDescription: `Description ${i}`,
                content: `Content ${i}`,
                blogId
            };

            const response = await repository.createPost(postInput);
            posts.push(response.body);

            // Add delay between posts to ensure different createdAt times
            if (i < count) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        return posts;
    }
}
