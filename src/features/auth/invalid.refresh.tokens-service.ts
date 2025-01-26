import {InvalidRefreshTokenType} from "./auth.type";
import {invalidRefreshTokensRepository} from "./invalid.refresh.tokens-repository";
import {InsertOneResult, WithId} from "mongodb";

export const invalidRefreshTokenService = {

    async addToBlacklist(token: string): Promise<InsertOneResult<InvalidRefreshTokenType>> {
        const invalidToken: InvalidRefreshTokenType = {
            token,
            expiredAt: new Date()
        }
        return invalidRefreshTokensRepository.createInvalidToken(invalidToken);
    },

    async isTokenInvalid(token: string): Promise<boolean> {
        const invalidToken: WithId<InvalidRefreshTokenType> | null = await invalidRefreshTokensRepository.findInvalidToken(token);
        if (!invalidToken) return false;

        return true;
    }
}