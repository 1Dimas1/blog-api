import {DeleteResult, InsertOneResult, ObjectId} from "mongodb";
import {UserDBType, UserType} from "./user.type";
import {userCollection} from "../../db/db";

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        return await userCollection.findOne({
            $or: [
                { email: loginOrEmail },
                { login: loginOrEmail }
            ]
        });
    },

    async findUserById(id: string): Promise<UserDBType | null> {
        return userCollection.findOne({_id: new ObjectId(id)});
    },

    async createUser(user: UserType): Promise<InsertOneResult<UserDBType>> {
        return userCollection.insertOne(user)
    },

    async deleteUser(id: string): Promise<DeleteResult> {
        return userCollection.deleteOne({_id: new ObjectId(id)})
    }
}