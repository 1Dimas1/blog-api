import {Router} from "express";
import {commentsController} from "./сomments-controller";
import {authGuard} from "../auth/auth-middleware";
import {commentContentValidator} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";

const commentsRouter: Router = Router();

commentsRouter.get('/:id',
    commentsController.getComment)

commentsRouter.put('/:id',
    authGuard,
    commentContentValidator,
    errorResultMiddleware,
    commentsController.updateComment)

commentsRouter.delete('/:id',
    authGuard,
    commentsController.deleteComment)

export default commentsRouter;