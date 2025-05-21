import {InvalidRefreshTokenDocument, InvalidRefreshTokenType} from "./auth.type";
import InvalidRefreshTokensRepository from "./invalid-refresh-tokens.repository";
import {inject, injectable} from "inversify";

@injectable()
export default class InvalidRefreshTokenService {
    constructor(
        @inject(InvalidRefreshTokensRepository)
        private invalidRefreshTokensRepository: InvalidRefreshTokensRepository
    ) {}

    async addToBlacklist(token: string): Promise<InvalidRefreshTokenDocument> {
        const invalidToken: InvalidRefreshTokenType = {
            token,
            expiredAt: new Date()
        }
        return this.invalidRefreshTokensRepository.createInvalidToken(invalidToken);
    }

    async isTokenInvalid(token: string): Promise<boolean> {
        const invalidToken: InvalidRefreshTokenDocument | null = await this.invalidRefreshTokensRepository.findInvalidToken(token);
        return invalidToken != null;
    }
}