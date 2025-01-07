import {NextFunction, Request, Response} from "express";
import {HTTP_CODES} from "../../common/http.statuses";
import {jwtService} from "./jwt-service";
import {ResultStatus} from "../../common/types/result.type";
import {usersRepository} from "../users/users-repository";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenResult = jwtService.extractTokenFromHeader(req.headers.authorization);

        if (tokenResult.status !== ResultStatus.Success) {
            res.status(HTTP_CODES.UNAUTHORIZED_401).json();
            return;
        }

        const verifyResult = jwtService.verifyToken(tokenResult.data!);

        if (verifyResult.status === ResultStatus.Success) {
            const userId= verifyResult.data!.userId;

            const user = await usersRepository.doesExistById(userId)

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