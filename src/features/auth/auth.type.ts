export type LoginSuccessDto = {
    accessToken: string;
}
export type LoginInputDto = {
    loginOrEmail: string,
    password: string,
}
export type UserInfoDto = {
    email: string;
    login: string;
    userId: string;
}