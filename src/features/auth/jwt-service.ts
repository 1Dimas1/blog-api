import jwt from 'jsonwebtoken';
import {Result, ResultStatus} from "../../common/types/result.type";
import {invalidRefreshTokenService} from "./invalid.refresh.tokens-service";

export type TokenPayload = {
    userId: string;
};

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: process.env.JWT_ACCESS_TIME }
        );
    },

    createRefreshToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: process.env.JWT_REFRESH_TIME }
        );
    },

    verifyAccessToken(token: string): Result<TokenPayload> {
        try {

            const secret: string = process.env.JWT_ACCESS_SECRET!;
            const decoded = jwt.verify(token, secret) as TokenPayload;

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
    },

    async verifyRefreshToken(token: string): Promise<Result<TokenPayload>> {
        try {
            const isTokenInvalid: boolean = await invalidRefreshTokenService.isTokenInvalid(token);
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

            const secret = process.env.JWT_REFRESH_SECRET!;
            const decoded = jwt.verify(token, secret) as TokenPayload;

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
    },

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

        const token = authHeader.split(' ')[1];

        return {
            status: ResultStatus.Success,
            data: token,
            extensions: []
        };
    },
};