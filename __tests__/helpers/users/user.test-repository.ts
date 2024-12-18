import {SETTINGS} from "../../../src/settings";
import {getValidCredentials} from "../test.helpers";
import {UserInputDto} from "./user.test.type";

export class UserTestRepository {
    constructor(private req: any) {}

    async getAllUsers(params: {
        sortBy?: string,
        sortDirection?: 'asc' | 'desc',
        pageNumber?: number,
        pageSize?: number,
        searchLoginTerm?: string,
        searchEmailTerm?: string
    } = {}) {
        let url = SETTINGS.PATH.USERS;
        const queryParams = new URLSearchParams();

        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
        if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.searchLoginTerm) queryParams.append('searchLoginTerm', params.searchLoginTerm);
        if (params.searchEmailTerm) queryParams.append('searchEmailTerm', params.searchEmailTerm);

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return this.req.get(url).set({'Authorization': getValidCredentials()});
    }

    async createUser(dto: UserInputDto) {
        return this.req
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': getValidCredentials()})
            .send(dto);
    }

    async deleteUser(id: string) {
        return this.req
            .delete(SETTINGS.PATH.USERS.concat(`/${id}`))
            .set({'Authorization': getValidCredentials()});
    }
}