import jwt from 'jsonwebtoken';
import {Result, ResultStatus} from "../../common/types/result.type";

export type TokenPayload = {
    userId: string;
};

export const jwtService = {
    createAccessToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_TIME }
        );
    },

    verifyToken(token: string): Result<TokenPayload> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

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

    extractTokenFromHeader(authHeader: string | undefined): Result<string> {
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
    }
};