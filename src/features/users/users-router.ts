import {Router} from "express";
import {usersController} from "./users-controller";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {userEmailValidator, userLoginValidator, userPasswordValidator} from "../../common/validation/field-validators";
import {validateUserExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";

const usersRouter = Router();

usersRouter.get('/',
    authAdminMiddleware,
    usersController.getUsers)

usersRouter.post('/',
    authAdminMiddleware,
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    usersController.createUser)

usersRouter.delete('/:id',
    authAdminMiddleware,
    validateUserExistsMiddleware,
    usersController.deleteUser)

export default usersRouter;