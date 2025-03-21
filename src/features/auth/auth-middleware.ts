import {NextFunction, Response} from "express";
import {HTTP_CODES} from "../../common/http.statuses";
import {AccessTokenPayload, jwtService} from "./jwt-service";
import {Result, ResultStatus} from "../../common/types/result.type";
import {usersRepository} from "../users/users-repository";
import {RequestWithAccessToken} from "../../common/types/request.type";


export const authGuard = async (req: RequestWithAccessToken, res: Response, next: NextFunction) => {
    try {
        const tokenResult: Result<string> = jwtService.extractAccessTokenFromHeader(req.headers.authorization);

        if (tokenResult.status !== ResultStatus.Success) {
            res.status(HTTP_CODES.UNAUTHORIZED_401).json();
            return;
        }

        const verifyResult: Result<AccessTokenPayload> = jwtService.verifyAccessToken(tokenResult.data!);

        if (verifyResult.status === ResultStatus.Success) {
            const userId: string= verifyResult.data!.userId;
            const user: boolean = await usersRepository.doesExistById(userId)

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