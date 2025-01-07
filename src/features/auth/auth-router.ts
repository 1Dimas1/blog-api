import {Router} from "express";
import {authController} from "./auth-controller";
import {loginUserLoginOrEmailValidator, loginUserPasswordValidator} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authGuard} from "./auth-middleware";

const authRouter = Router();

authRouter.post('/login',
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator,
    errorResultMiddleware,
    authController.loginUser)

authRouter.get('/me',
    authGuard,
    authController.getCurrentUser)

export default  authRouter;