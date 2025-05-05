import {InvalidRefreshTokenType} from "./auth.type";
import InvalidRefreshTokensRepository from "./invalid-refresh-tokens.repository";
import {InsertOneResult, WithId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export default class InvalidRefreshTokenService {
    constructor(
        @inject(InvalidRefreshTokensRepository)
        private invalidRefreshTokensRepository: InvalidRefreshTokensRepository
    ) {}

    async addToBlacklist(token: string): Promise<InsertOneResult<InvalidRefreshTokenType>> {
        const invalidToken: InvalidRefreshTokenType = {
            token,
            expiredAt: new Date()
        }
        return this.invalidRefreshTokensRepository.createInvalidToken(invalidToken);
    }

    async isTokenInvalid(token: string): Promise<boolean> {
        const invalidToken: WithId<InvalidRefreshTokenType> | null = await this.invalidRefreshTokensRepository.findInvalidToken(token);
        if (!invalidToken) return false;

        return true;
    }
}