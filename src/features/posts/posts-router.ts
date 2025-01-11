import { Router } from 'express';
import {postsController} from "./posts-controller";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {
    blogIdValidator, commentContentValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {validatePostExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";
import {commentsController} from "../comments/сomments-controller";
import {authGuard} from "../auth/auth-middleware";

const postsRouter: Router = Router();

postsRouter.get('/:id/comments',
    commentsController.getCommentsByPost);

postsRouter.post('/:id/comments',
    authGuard,
    validatePostExistsMiddleware,
    commentContentValidator,
    errorResultMiddleware,
    commentsController.createComment);

postsRouter.get('/', postsController.getPosts);

postsRouter.get('/:id',
    validatePostExistsMiddleware,
    postsController.getPostById);

postsRouter.post('/',
    authAdminMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.createPost);

postsRouter.put('/:id',
    authAdminMiddleware,
    validatePostExistsMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.updatePost);

postsRouter.delete('/:id',
    authAdminMiddleware,
    validatePostExistsMiddleware,
    postsController.deletePost);

export default postsRouter;