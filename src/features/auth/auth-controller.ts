import {RequestWithBody, RequestWithRefreshToken} from "../../common/types/request.type";
import {Request, Response} from "express";
import {authService} from "./auth-service";
import {HTTP_CODES} from "../../common/http.statuses";
import {resultCodeToHttpException} from "../../common/helpers/result-code.mapper";
import {Result, ResultStatus} from "../../common/types/result.type";
import {
    LoginInputDto,
    LoginSuccessDto,
    RegistrationConfirmationDto, RegistrationEmailResendingDto,
    RegistrationInputDto,
    UserInfoDto
} from "./auth.type";

export const authController = {
    async loginUser(req: RequestWithBody<LoginInputDto>, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;

            const result: Result<LoginSuccessDto | null> = await authService.loginUser(loginOrEmail, password);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).send(result.extensions);
                return;
            }

            res.cookie('refreshToken', result.data!.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20 * 1000
            });
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

    async refreshToken(req: RequestWithRefreshToken, res: Response) {
        try {
            if (!req.cookies.refreshToken) {
                res.status(HTTP_CODES.UNAUTHORIZED_401).json({
                    errorsMessages: [{
                        message: "Unauthorized",
                        field: "authorization"
                    }]
                });
                return;
            }

            const refreshToken: string = req.cookies.refreshToken;
            const result: Result<LoginSuccessDto> = await authService.refreshTokens(refreshToken);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status))
                    .json({ errorsMessages: result.extensions });
                return;
            }

            res.cookie('refreshToken', result.data!.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20 * 1000
            });
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

    async logout(req: RequestWithRefreshToken, res: Response) {
        try {
            if (!req.cookies.refreshToken) {
                res.status(HTTP_CODES.UNAUTHORIZED_401).json({
                    errorsMessages: [{
                        message: "Unauthorized",
                        field: "authorization"
                    }]
                });
                return;
            }

            const refreshToken: string = req.cookies.refreshToken;
            const result: Result = await authService.logout(refreshToken);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status))
                    .json({ errorsMessages: result.extensions });
                return;
            }

            res.clearCookie('refreshToken');
            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({
                errorsMessages: [{
                    message: "Internal server error",
                    field: "server"
                }]
            });
        }
    },

    async registerUser(req: RequestWithBody<RegistrationInputDto>, res: Response) {
        try {
            const result: Result = await authService.registerUser(req.body);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).json({
                    errorsMessages: result.extensions
                });
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({
                errorsMessages: [{
                    message: "Internal server error",
                    field: "server"
                }]
            });
        }
    },

    async confirmRegistration(req: RequestWithBody<RegistrationConfirmationDto>, res: Response) {
        try {
            const result: Result = await authService.confirmRegistration(req.body.code);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).json({
                    errorsMessages: result.extensions
                });
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR_500).json({
                errorsMessages: [{
                    message: "Internal server error",
                    field: "server"
                }]
            });
        }
    },

    async resendConfirmationEmail(req: RequestWithBody<RegistrationEmailResendingDto>, res: Response) {
        try {
            const result: Result = await authService.resendConfirmationEmail(req.body.email);

            if (result.status !== ResultStatus.Success) {
                res.status(resultCodeToHttpException(result.status)).json({
                    errorsMessages: result.extensions
                });
                return;
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
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