import {InvalidRefreshTokenDocument, InvalidRefreshTokenType} from "./auth.type";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";
import {InvalidRefreshTokenModel} from "./invalid-refresh-token-model";

@injectable()
export default class InvalidRefreshTokensRepository {

    async createInvalidToken(token: InvalidRefreshTokenType):Promise<InvalidRefreshTokenDocument> {
        return InvalidRefreshTokenModel.insertOne(token)
    }

    async findInvalidToken(token: string): Promise<InvalidRefreshTokenDocument | null> {
        return InvalidRefreshTokenModel.findOne({ token }).exec();
    }

    async deleteInvalidToken(token: string): Promise<DeleteResult> {
        return InvalidRefreshTokenModel.deleteOne({ token })
    }

    async cleanup(): Promise<DeleteResult> {
        return InvalidRefreshTokenModel.deleteMany({
            expiredAt: { $lt: new Date() }
        });
    }
}