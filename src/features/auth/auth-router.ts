import {Router} from "express";
import {authController} from "./auth-controller";
import {
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator, userEmailValidator,
    userLoginValidator, userPasswordValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authGuard} from "./auth-middleware";

const authRouter: Router = Router();

authRouter.post('/login',
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator,
    errorResultMiddleware,
    authController.loginUser)

authRouter.get('/me',
    authGuard,
    authController.getCurrentUser)

authRouter.post('/registration',
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    authController.registerUser);

authRouter.post('/registration-confirmation',
    authController.confirmRegistration);

authRouter.post('/registration-email-resending',
    userEmailValidator,
    errorResultMiddleware,
    authController.resendConfirmationEmail);

export default  authRouter;