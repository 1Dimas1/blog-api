import {SortDirection, WithId} from "mongodb";

export type UserType = {
    login: string,
    email: string,
    password: string,
    createdAt: string,
}

export type UserDBType = WithId<UserType>

export type UserViewModel = Omit<UserType, 'password'> & {
    id: string,
}

export type UserInputType = {
    login: string,
    email: string,
    password: string,
}

export type UsersPaginationViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[],
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