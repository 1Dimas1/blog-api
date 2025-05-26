import {Router} from "express";
import CommentsController from "./сomments-controller";
import {authGuard, optionalAuthGuard} from "../auth/auth-middleware";
import {commentContentValidator, likeStatusValidator} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import container from "../../container/inversify.config";

const commentsRouter: Router = Router();
const commentsController: CommentsController = container.get<CommentsController>(CommentsController);

commentsRouter.get('/:id',
    optionalAuthGuard,
    commentsController.getComment.bind(commentsController));

commentsRouter.put('/:id',
    authGuard,
    commentContentValidator,
    errorResultMiddleware,
    commentsController.updateComment.bind(commentsController));

commentsRouter.put('/:id/like-status',
    authGuard,
    likeStatusValidator,
    errorResultMiddleware,
    commentsController.updateCommentLikeStatus.bind(commentsController));

commentsRouter.delete('/:id',
    authGuard,
    commentsController.deleteComment.bind(commentsController));

export default commentsRouter;