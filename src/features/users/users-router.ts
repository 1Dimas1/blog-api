import {Router} from "express";
import UsersController from "./users-controller";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {userEmailValidator, userLoginValidator, userPasswordValidator} from "../../common/validation/field-validators";
import {validateUserExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";
import container from "../../container/inversify.config";

const usersRouter: Router = Router();

const usersController: UsersController = container.get(UsersController);

usersRouter.get('/',
    authAdminMiddleware,
    usersController.getUsers.bind(usersController))

usersRouter.post('/',
    authAdminMiddleware,
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id',
    authAdminMiddleware,
    validateUserExistsMiddleware,
    usersController.deleteUser.bind(usersController))

export default usersRouter;