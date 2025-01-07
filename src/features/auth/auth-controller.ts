import {RequestWithBody} from "../../common/types/request.type";
import {Request, Response} from "express";
import {authService} from "./auth-service";
import {HTTP_CODES} from "../../common/http.statuses";
import {resultCodeToHttpException} from "../../common/helpers/result-code.mapper";
import {Result, ResultStatus} from "../../common/types/result.type";
import {LoginInputDto, LoginSuccessDto, UserInfoDto} from "./auth.type";

export const authController = {
    async loginUser(req: RequestWithBody<LoginInputDto>, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;

            const result: Result<LoginSuccessDto | null> = await authService.loginUser(loginOrEmail, password);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.status(HTTP_CODES.OK_200).json({
                accessToken: result.data!.accessToken
            });
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({
                errorsMessages: [{
                    message: "Internal server error",
                    field: "server"
                }]
            });
        }
    },
    async getCurrentUser(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED_401).json({
                    errorsMessages: [{
                        message: "Unauthorized",
                        field: "authorization"
                    }]
                });
                return;
            }

            const result: Result<UserInfoDto> = await authService.getCurrentUser(req.userId);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.status(HTTP_CODES.OK_200).json(result.data);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({
                errorsMessages: [{
                    message: "Internal server error",
                    field: "server"
                }]
            });
        }
    },
}