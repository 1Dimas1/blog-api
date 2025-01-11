import {SortDirection} from "mongodb";
import {UserViewModel, UsersPaginationViewModel} from "./user.type";
import {buildFindUsersQuery} from "../../common/helpers/find-query-builders";
import {usersQueryRepository} from "./users-queryRepository";

export const usersQueryService = {
    async getUsers(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
    ): Promise<UsersPaginationViewModel> {
        const findUsersQuery = buildFindUsersQuery(searchLoginTerm, searchEmailTerm);

        const users: UserViewModel[] = await usersQueryRepository.getUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            findUsersQuery)

        const usersCount: number = await usersQueryRepository.getUsersCount(findUsersQuery)

        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users
        }
    }
}