import {Router} from "express";
import AuthController from "./auth-controller";
import {
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator, newPasswordValidator, recoveryCodeValidator, userEmailValidator,
    userLoginValidator, userPasswordValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authGuard} from "./auth-middleware";
import {rateLimitMiddleware} from "../../common/rate-limit/rate-limit-middleware";
import container from "../../container/inversify.config";

const authRouter: Router = Router();

const authController: AuthController = container.get(AuthController);

authRouter.post('/login',
    rateLimitMiddleware,
    loginUserLoginOrEmailValidator,
    loginUserPasswordValidator,
    errorResultMiddleware,
    authController.loginUser.bind(authController))

authRouter.post('/refresh-token',
    authController.refreshToken.bind(authController));

authRouter.post('/logout',
    authController.logout.bind(authController));

authRouter.get('/me',
    authGuard,
    authController.getCurrentUser.bind(authController));

authRouter.post('/registration',
    rateLimitMiddleware,
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    authController.registerUser.bind(authController));

authRouter.post('/registration-confirmation',
    rateLimitMiddleware,
    authController.confirmRegistration.bind(authController));

authRouter.post('/registration-email-resending',
    rateLimitMiddleware,
    userEmailValidator,
    errorResultMiddleware,
    authController.resendConfirmationEmail.bind(authController));

authRouter.post('/password-recovery',
    rateLimitMiddleware,
    userEmailValidator,
    errorResultMiddleware,
    authController.passwordRecovery.bind(authController));

authRouter.post('/new-password',
    rateLimitMiddleware,
    newPasswordValidator,
    recoveryCodeValidator,
    errorResultMiddleware,
    authController.setNewPassword.bind(authController));

export default  authRouter;