import { Router } from 'express';
import {postsController} from "./posts-controller";
import {authorisationMiddleware} from "../auth/authorisation-middleware";
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
    authorisationMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.createPost);

postsRouter.put('/:id',
    authorisationMiddleware,
    validatePostExistsMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.updatePost);

postsRouter.delete('/:id',
    authorisationMiddleware,
    validatePostExistsMiddleware,
    postsController.deletePost);

export default postsRouter;