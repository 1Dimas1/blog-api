import {Router} from "express";
import {authController} from "./auth-controller";
import {
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator, newPasswordValidator, recoveryCodeValidator, userEmailValidator,
    userLoginValidator, userPasswordValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authGuard} from "./auth-middleware";
import {rateLimitMiddleware} from "../../common/rate-limit/rate-limit-middleware";

const authRouter: Router = Router();

authRouter.post('/login',
    rateLimitMiddleware,
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator,
    errorResultMiddleware,
    authController.loginUser)

authRouter.post('/refresh-token',
    authController.refreshToken);

authRouter.post('/logout',
    authController.logout);

authRouter.get('/me',
    authGuard,
    authController.getCurrentUser)

authRouter.post('/registration',
    rateLimitMiddleware,
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    authController.registerUser);

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    authController.confirmRegistration);

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    userEmailValidator,
    errorResultMiddleware,
    authController.resendConfirmationEmail);

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    userEmailValidator,
    errorResultMiddleware,
    authController.passwordRecovery);

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidator,
    recoveryCodeValidator,
    errorResultMiddleware,
    authController.setNewPassword);

export default  authRouter;