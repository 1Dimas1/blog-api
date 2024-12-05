import {Router} from "express";
import {usersController} from "../controllers/users-controller";
import {authorisationMiddleware} from "../midlewares/authorisation-middleware";
import {errorResultMiddleware} from "../midlewares/errors-result-middleware";
import {userEmailValidator, userLoginValidator, userPasswordValidator} from "../validation/field-validators";

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

export default usersRouter;