import {ObjectId, SortDirection} from "mongodb";
import {UserDBType, UserOutPutType} from "./user.type";
import {userCollection} from "../../db/db";

export const usersQueryRepository = {
    async getUsers(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        query: any
    ): Promise<UserOutPutType[]> {
        const users: UserDBType[] = await userCollection
            .find(query)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        return users.map(this._mapToOutput)
    },
    async getUsersCount(query: any): Promise<number> {
        return userCollection.countDocuments(query)
    },
    async findUserById(id: string): Promise<UserOutPutType | null> {
        const user: UserDBType | null = await userCollection.findOne({_id: new ObjectId(id)});
        return user ? this._mapToOutput(user) : null;
    },
    _mapToOutput(user: UserDBType): UserOutPutType {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}