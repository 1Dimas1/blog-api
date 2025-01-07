import {LoginInputDto} from "./auth.test.type";
import {SETTINGS} from "../../../src/settings";

export class AuthTestRepository {
    constructor(private req: any) {}

    async login(dto: LoginInputDto) {
        return this.req
            .post(SETTINGS.PATH.AUTH.concat('/login'))
            .send(dto);
    }

    async getMe(accessToken?: string) {
        const request = this.req.get(SETTINGS.PATH.AUTH.concat('/me'));
        if (accessToken) {
            request.set('Authorization', `Bearer ${accessToken}`);
        }
        return request;
    }
}