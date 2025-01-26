export type LoginSuccessDto = {
    accessToken: string;
    refreshToken: string;
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

export type RegistrationInputDto = {
    login: string;
    password: string;
    email: string;
};

export type RegistrationConfirmationDto = {
    code: string;
};

export type RegistrationEmailResendingDto = {
    email: string;
};

export type InvalidRefreshTokenType = {
    token: string;
    expiredAt: Date;
}
