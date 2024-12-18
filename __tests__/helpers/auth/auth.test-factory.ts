import {LoginInputDto} from "./auth.test.type";

export const authTestFactory = {
    createLoginInputDto(params: Partial<LoginInputDto> = {}): LoginInputDto {
        return {
            loginOrEmail: params.loginOrEmail ?? 'test@example.com',
            password: params.password ?? 'password123'
        }
    }
}