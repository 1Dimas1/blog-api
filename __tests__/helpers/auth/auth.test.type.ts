export type LoginInputDto = {
    loginOrEmail: string
    password: string
}

export type LoginSuccessDto = {
    accessToken: string
}

export type MeResponseDto = {
    email: string
    login: string
    userId: string
}