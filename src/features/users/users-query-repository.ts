import {ObjectId, SortDirection} from "mongodb";
import {UserDBType, UserViewModel} from "./user.type";
import {userCollection} from "../../db/db";
import {injectable} from "inversify";

@injectable()
export default class UsersQueryRepository {
    async getUsers(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        query: any
    ): Promise<UserViewModel[]> {
        const users: UserDBType[] = await userCollection
            .find(query)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        return users.map(this._mapToOutput)
    }

    async getUsersCount(query: any): Promise<number> {
        return userCollection.countDocuments(query)
    }

    async findUserById(id: string): Promise<UserViewModel | null> {
        const user: UserDBType | null = await userCollection.findOne({_id: new ObjectId(id)});
        return user ? this._mapToOutput(user) : null;
    }

    _mapToOutput(user: UserDBType): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}