import { Router } from 'express';
import {PostsController} from "./posts-controller";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {
    blogIdValidator, commentContentValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {validatePostExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";
import CommentsController from "../comments/сomments-controller";
import {authGuard} from "../auth/auth-middleware";
import container from "../../container/inversify.config";

const postsRouter: Router = Router();
const postsController: PostsController = container.get<PostsController>(PostsController);
const commentsController: CommentsController = container.get<CommentsController>(CommentsController);

postsRouter.get('/:id/comments',
    commentsController.getCommentsByPost.bind(commentsController));

postsRouter.post('/:id/comments',
    authGuard,
    validatePostExistsMiddleware,
    commentContentValidator,
    errorResultMiddleware,
    commentsController.createComment.bind(commentsController));

postsRouter.get('/', postsController.getPosts.bind(postsController));

postsRouter.get('/:id',
    validatePostExistsMiddleware,
    postsController.getPostById.bind(postsController));

postsRouter.post('/',
    authAdminMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.createPost.bind(postsController));

postsRouter.put('/:id',
    authAdminMiddleware,
    validatePostExistsMiddleware,
    blogIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    postsController.updatePost.bind(postsController));

postsRouter.delete('/:id',
    authAdminMiddleware,
    validatePostExistsMiddleware,
    postsController.deletePost.bind(postsController));

export default postsRouter;