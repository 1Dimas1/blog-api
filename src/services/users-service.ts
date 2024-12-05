import {InsertOneResult, ObjectId, SortDirection} from "mongodb";
import {UserDBType, UserInputType, UserOutPutType, UsersPaginator} from "../types/user.type";
import {buildFindUsersQuery} from "../helpers/find-query-builders";
import {usersRepository} from "../repositories/users-repository";

export const usersService = {
    async getUsers (
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
    ): Promise<UsersPaginator> {
        const findUsersQuery = buildFindUsersQuery(searchLoginTerm, searchEmailTerm);

        const users: UserDBType[] = await usersRepository.getUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            findUsersQuery)

        const usersCount: number = await usersRepository.getUsersCount(findUsersQuery)

        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users.map(usersRepository.mapToOutput)
        }
    },
    async createUser(body: UserInputType): Promise<UserOutPutType> {
        const user: UserDBType = {
            _id: new ObjectId(),
            login: body.login,
            email: body.email,
            createdAt: new Date().toISOString(),
        }

        const result: InsertOneResult<UserDBType> = await usersRepository.createUser(user);
        return usersRepository.mapToOutput(user)
    },
    async getNonUniqueField(login: string, email: string): Promise<string | null> {
        const loginUser = await usersRepository.findByLoginOrEmail(login);
        if (loginUser) {
            return 'login';
        }

        const emailUser = await usersRepository.findByLoginOrEmail(email);
        if (emailUser) {
            return 'email';
        }

        return null;
    }
}