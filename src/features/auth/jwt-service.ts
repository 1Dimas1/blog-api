import jwt from 'jsonwebtoken';
import {Result, ResultStatus} from "../../common/types/result.type";
import InvalidRefreshTokenService from "./invalid.refresh.tokens-service";
import {inject, injectable} from "inversify";

export type AccessTokenPayload = {
    userId: string;
};

export type RefreshTokenPayload = {
    userId: string;
    deviceId: string;
};

@injectable()
export class JwtService {
    constructor(@inject(InvalidRefreshTokenService) private invalidRefreshTokenService: InvalidRefreshTokenService) {}

    createAccessToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: process.env.JWT_ACCESS_TIME }
        );
    }

    createRefreshToken(userId: string, deviceId: string): string {
        return jwt.sign(
            { userId, deviceId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: process.env.JWT_REFRESH_TIME }
        );
    }

    verifyAccessToken(token: string): Result<AccessTokenPayload> {
        try {

            const secret: string = process.env.JWT_ACCESS_SECRET!;
            const decoded = jwt.verify(token, secret) as AccessTokenPayload;

            return {
                status: ResultStatus.Success,
                data: decoded,
                extensions: []
            };
        } catch (error) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{
                    message: "Invalid token",
                    field: "authorization"
                }]
            };
        }
    }

    async verifyRefreshToken(token: string): Promise<Result<RefreshTokenPayload>> {
        try {
            const isTokenInvalid: boolean = await this.invalidRefreshTokenService.isTokenInvalid(token);
            if (isTokenInvalid) {
                return {
                    status: ResultStatus.Unauthorized,
                    data: null,
                    errorMessage: 'Refresh Token is invalid',
                    extensions: [{
                        message: "Refresh Token Token is blacklisted",
                        field: "authorization"
                    }]
                };
            }

            const secret: string = process.env.JWT_REFRESH_SECRET!;
            const decoded = jwt.verify(token, secret) as RefreshTokenPayload;

            return {
                status: ResultStatus.Success,
                data: decoded,
                extensions: []
            };
        } catch (error) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{
                    message: "Invalid token",
                    field: "authorization"
                }]
            };
        }
    }

    extractAccessTokenFromHeader(authHeader: string | undefined): Result<string> {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{
                    message: "Invalid authorization header",
                    field: "authorization"
                }]
            };
        }

        const token: string = authHeader.split(' ')[1];

        return {
            status: ResultStatus.Success,
            data: token,
            extensions: []
        };
    }
}