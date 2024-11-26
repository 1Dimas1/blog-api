import { Router } from 'express';
import {postsController} from "../controllers/posts-controller";
import {authorisationMiddleware} from "../midlewares/authorisation-middleware";
import {
    blogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../validation/field-validators";
import {errorResultMiddleware} from "../midlewares/errors-result-middleware";
import {validatePostExistsMiddleware} from "../midlewares/id-params-validation-middleware";

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
    blogIdValidator,
    errorResultMiddleware,
    postsController.createPost);

postsRouter.put('/:id',
    authorisationMiddleware,
    validatePostExistsMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    blogIdValidator,
    errorResultMiddleware,
    postsController.updatePost);

postsRouter.delete('/:id',
    authorisationMiddleware,
    validatePostExistsMiddleware,
    postsController.deletePost);

export default postsRouter;