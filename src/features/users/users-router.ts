import {Router} from "express";
import {usersController} from "./users-controller";
import {authorisationMiddleware} from "../auth/authorisation-middleware";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {userEmailValidator, userLoginValidator, userPasswordValidator} from "../../common/validation/field-validators";
import {validateUserExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";

const usersRouter = Router();

usersRouter.get('/',
    authorisationMiddleware,
    usersController.getUsers)

usersRouter.post('/',
    authorisationMiddleware,
    userLoginValidator,
    userEmailValidator,
    userPasswordValidator,
    errorResultMiddleware,
    usersController.createUser)

usersRouter.delete('/:id',
    authorisationMiddleware,
    validateUserExistsMiddleware,
    usersController.deleteUser)

export default usersRouter;