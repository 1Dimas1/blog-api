import {SETTINGS} from "../../../src/settings";
import {BlogInputDto, BlogsResponse} from "./blog.test.type";
import {getValidCredentials} from "../test.helpers";

export class BlogTestRepository {
    constructor(private req: any) {}

    async getAllBlogs(params: {
        searchNameTerm?: string,
        pageNumber?: number,
        pageSize?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc'
    } = {}):  Promise<{ status: number, body: BlogsResponse }> {
        let url = SETTINGS.PATH.BLOGS;
        const queryParams = new URLSearchParams();

        if (params.searchNameTerm) queryParams.append('searchNameTerm', params.searchNameTerm);
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

    async getBlogById(id: string) {
        return this.req.get(SETTINGS.PATH.BLOGS.concat(`/${id}`));
    }

    async createBlog(dto: BlogInputDto, auth = true) {
        const request = this.req.post(SETTINGS.PATH.BLOGS).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async updateBlog(id: string, dto: BlogInputDto, auth = true) {
        const request = this.req.put(SETTINGS.PATH.BLOGS.concat(`/${id}`)).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async deleteBlog(id: string, auth = true) {
        const request = this.req.delete(SETTINGS.PATH.BLOGS.concat(`/${id}`));
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }

    async getPostsForBlog(blogId: string, params: {
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

    async createPostForBlog(blogId: string, dto: any, auth = true) {
        const request = this.req.post(SETTINGS.PATH.BLOGS.concat(`/${blogId}/posts`)).send(dto);
        if (auth) {
            request.set({'Authorization': getValidCredentials()});
        }
        return request;
    }
}