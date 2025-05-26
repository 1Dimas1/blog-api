import {NextFunction, Response} from "express";
import {HTTP_CODES} from "../../common/http.statuses";
import {AccessTokenPayload, JwtService} from "./jwt-service";
import {Result, ResultStatus} from "../../common/types/result.type";
import UsersRepository from "../users/users-repository";
import {RequestWithAccessToken} from "../../common/types/request.type";
import container from "../../container/inversify.config";


export const authGuard = async (req: RequestWithAccessToken, res: Response, next: NextFunction) => {
    const jwtService: JwtService = container.get(JwtService)
    const userRepository: UsersRepository = container.get(UsersRepository)

    try {
        const tokenResult: Result<string> = jwtService.extractAccessTokenFromHeader(req.headers.authorization);

        if (tokenResult.status !== ResultStatus.Success) {
            res.status(HTTP_CODES.UNAUTHORIZED_401).json();
            return;
        }

        const verifyResult: Result<AccessTokenPayload> = jwtService.verifyAccessToken(tokenResult.data!);

        if (verifyResult.status === ResultStatus.Success) {
            const userId: string= verifyResult.data!.userId;
            const user: boolean = await userRepository.doesExistById(userId)

            if(!user) {
                res.status(HTTP_CODES.UNAUTHORIZED_401).json({
                });
                return;
            }

            req.userId = userId;
            return next();
        }
        res.sendStatus(HTTP_CODES.UNAUTHORIZED_401)
    } catch (error) {
        res.status(HTTP_CODES.UNAUTHORIZED_401).json({
            errorsMessages: [{
                message: "Unauthorized",
                field: "authorization"
            }]
        });
    }
};

export const optionalAuthGuard = async (req: RequestWithAccessToken, res: Response, next: NextFunction) => {
    const jwtService: JwtService = container.get(JwtService)
    const userRepository: UsersRepository = container.get(UsersRepository)

    try {
        const tokenResult: Result<string> = jwtService.extractAccessTokenFromHeader(req.headers.authorization);

        if (tokenResult.status !== ResultStatus.Success) {
            return next();
        }

        const verifyResult: Result<AccessTokenPayload> = jwtService.verifyAccessToken(tokenResult.data!);

        if (verifyResult.status === ResultStatus.Success) {
            const userId: string= verifyResult.data!.userId;
            const user: boolean = await userRepository.doesExistById(userId)

            if(!user) {
                return next();
            }

            req.userId = userId;
            return next();
        }
        return next();
    } catch (error) {
        next();
    }
};