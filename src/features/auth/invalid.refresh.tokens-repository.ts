import {InvalidRefreshTokenType} from "./auth.type";
import {invalidRefreshTokenCollection} from "../../db/db";
import {DeleteResult, InsertOneResult, WithId} from "mongodb";

export const invalidRefreshTokensRepository = {

    async createInvalidToken(token: InvalidRefreshTokenType):Promise<InsertOneResult<InvalidRefreshTokenType>> {
        return invalidRefreshTokenCollection.insertOne(token)
    },

    async findInvalidToken(token: string): Promise<WithId<InvalidRefreshTokenType> | null> {
        return invalidRefreshTokenCollection.findOne({ token });
    },

    async deleteInvalidToken(token: string): Promise<DeleteResult> {
        return invalidRefreshTokenCollection.deleteOne({ token })
    },

    async cleanup(): Promise<DeleteResult> {
        return invalidRefreshTokenCollection.deleteMany({
            expiredAt: { $lt: new Date() }
        });
    }
}