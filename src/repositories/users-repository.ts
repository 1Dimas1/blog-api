import {InsertOneResult, SortDirection} from "mongodb";
import {UserDBType, UserOutPutType} from "../types/user.type";
import {userCollection} from "../db/db";

export const usersRepository = {
    async getUsers(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
        query: any
    ): Promise<UserDBType[]> {
        return userCollection
            .find(query)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getUsersCount(query:any): Promise<number> {
        return userCollection.countDocuments(query)
    },
    async findByLoginOrEmail(loginOrEmail: string){
        const user: UserDBType | null = await userCollection.findOne({ $or: [{ email: loginOrEmail}, { login: loginOrEmail}]})
        return user
    },
    async createUser(user: UserDBType): Promise<InsertOneResult<UserDBType>> {
        return userCollection.insertOne(user)
    },
    mapToOutput(user: UserDBType): UserOutPutType {
        return{
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}