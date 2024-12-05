import {ObjectId, SortDirection} from "mongodb";

export type UserDBType = {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
}

export type UserOutPutType = {
    id: string,
    login: string,
    email: string,
    createdAt: string,
}

export type UserInputType = {
    login: string,
    email: string,
    createdAt: string,
}

export type UsersPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserOutPutType[]
}

export type QueryUserType = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: string,
    pageSize?: string,
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,

}