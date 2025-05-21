import {HydratedDocument, Model} from "mongoose";

export type LoginSuccessDto = {
    accessToken: string;
    refreshToken: string;
}
export type LoginInputDto = {
    loginOrEmail: string,
    password: string,
}

export type LoginUserDto = {
    loginOrEmail: string;
    password: string;
    ip?: string;
    userAgent?: string;
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


export type PasswordRecoveryInputDto = {
    email: string;
};

export type NewPasswordInputDto = {
    newPassword: string;
    recoveryCode: string;
};

export type InvalidRefreshTokenType = {
    token: string;
    expiredAt: Date;
}

export type InvalidRefreshTokenDocument = HydratedDocument<InvalidRefreshTokenType>

export type InvalidRefreshTokenModelType = Model<InvalidRefreshTokenType, {}, {}, {}, InvalidRefreshTokenDocument>