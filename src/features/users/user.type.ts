import {SortDirection, WithId} from "mongodb";

export type UserType = {
    login: string,
    email: string,
    password: string,
    createdAt: string,
}

export type UserDBType = WithId<UserType>

export type UserOutPutType = Omit<UserType, 'password'> & {
    id: string,
}

export type UserInputType = {
    login: string,
    email: string,
    password: string,
}

export type LoginUserInputType = {
    loginOrEmail: string,
    password: string,
}

export type UsersPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserOutPutType[],
}

export type QueryUserType = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string,
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
}

export type URIParamsUserIdType = {
    id: string
}