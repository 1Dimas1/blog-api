import {SortDirection} from "mongodb";
import {HydratedDocument, Model} from "mongoose";

export type EmailConfirmationType = {
    confirmationCode: string | null;
    expirationDate: string | null;
    isConfirmed: boolean;
}

export type PasswordRecoveryType = {
    recoveryCode: string | null;
    expirationDate: Date | null;
}

export type UserType = {
    login: string,
    email: string,
    password: string,
    createdAt: Date,
    emailConfirmation: EmailConfirmationType;
    passwordRecovery?: PasswordRecoveryType;
}

export type UserViewType = Omit<UserType, 'password' | 'emailConfirmation'> & {
    id: string,
}

export type UserInputType = {
    login: string,
    email: string,
    password: string,
}

export type UsersPaginationViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewType[],
}

export type QueryUserType = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string,
    searchLoginTerm?: string,
    searchEmailTerm?: string,
}

export type URIParamsUserIdType = {
    id: string
}

export type UserDocument = HydratedDocument<UserType>

export type UserModelType = Model<UserType, {}, {}, {}, UserDocument>