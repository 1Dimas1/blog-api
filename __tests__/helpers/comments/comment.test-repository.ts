import {SETTINGS} from "../../../src/settings";
import {CommentInputDto} from "./comment.test.type";


export class CommentTestRepository {
    constructor(private req: any) {}

    async getComments(postId: string, params: {
        pageNumber?: number,
        pageSize?: number,
        sortBy?: string,
        sortDirection?: 'asc' | 'desc'
    } = {}) {
        let url = `${SETTINGS.PATH.POSTS}/${postId}/comments`;
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

    async getCommentById(id: string) {
        return this.req.get(`${SETTINGS.PATH.COMMENTS}/${id}`);
    }

    async createComment(postId: string, dto: CommentInputDto, token: string) {
        return this.req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send(dto);
    }

    async updateComment(id: string, dto: CommentInputDto, token: string) {
        return this.req
            .put(`${SETTINGS.PATH.COMMENTS}/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(dto);
    }

    async deleteComment(id: string, token: string) {
        return this.req
            .delete(`${SETTINGS.PATH.COMMENTS}/${id}`)
            .set('Authorization', `Bearer ${token}`);
    }
}