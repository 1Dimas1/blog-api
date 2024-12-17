import {SETTINGS} from "../../../src/settings";
import {PostCreateByBlogIdDto, PostInputDto} from "./post.test.type";
import {getValidCredentials} from "../test.helpers";

export class PostTestRepository {
    constructor(private req: any) {}

    async getAllPosts(params: {
        pageNumber?: number,
        pageSize?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc'
    } = {}) {
        let url = SETTINGS.PATH.POSTS;
        const queryParams = new URLSearchParams();

        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return this.req.get(url);
    }

    async getPostById(id: string) {
        return this.req.get(SETTINGS.PATH.POSTS.concat(`/${id}`));
    }

    async createPost(dto: PostInputDto, auth = true) {
        const request = this.req.post(SETTINGS.PATH.POSTS).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async createPostByBlogId(blogId: string, dto: PostCreateByBlogIdDto, auth = true) {
        const request = this.req.post(SETTINGS.PATH.BLOGS.concat(`/${blogId}/posts`)).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async updatePost(id: string, dto: PostInputDto, auth = true) {
        const request = this.req.put(SETTINGS.PATH.POSTS.concat(`/${id}`)).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async deletePost(id: string, auth = true) {
        const request = this.req.delete(SETTINGS.PATH.POSTS.concat(`/${id}`));
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async getPostsByBlogId(blogId: string, params: {
        pageNumber?: number,
        pageSize?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc'
    } = {}) {
        let url = SETTINGS.PATH.BLOGS.concat(`/${blogId}/posts`);
        const queryParams = new URLSearchParams();

        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return this.req.get(url);
    }
}