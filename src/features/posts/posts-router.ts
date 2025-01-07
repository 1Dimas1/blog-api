import { Router } from 'express';
import {postsController} from "./posts-controller";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {
    blogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {validatePostExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";

const postsRouter = Router();

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