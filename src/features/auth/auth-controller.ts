import {RequestWithBody} from "../../common/types/request.type";
import {LoginUserInputType} from "../users/user.type";
import {Response} from "express";
import {authService} from "./auth-service";
import {HTTP_CODES} from "../../settings";

export const authController = {
    async loginUser(req: RequestWithBody<LoginUserInputType>, res: Response) {
        const isAuthenticated: boolean = await authService.loginUser(req.body.loginOrEmail, req.body.password)
        if (isAuthenticated) {
            res.sendStatus(HTTP_CODES.NO_CONTENT_204)
            return;
        } else {
            res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
            return;
        }
    }
}