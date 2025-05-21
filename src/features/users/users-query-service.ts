import {SortDirection} from "mongodb";
import {UserViewType, UsersPaginationViewType} from "./user.type";
import {buildFindUsersQuery} from "../../common/helpers/find-query-builders";
import UsersQueryRepository from "./users-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export default class UsersQueryService {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository) {}

    async getUsers(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
    ): Promise<UsersPaginationViewType> {
        const findUsersQuery = buildFindUsersQuery(searchLoginTerm, searchEmailTerm);

        const users: UserViewType[] = await this.usersQueryRepository.getUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            findUsersQuery)

        const usersCount: number = await this.usersQueryRepository.getUsersCount(findUsersQuery)

        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: users
        }
    }
}