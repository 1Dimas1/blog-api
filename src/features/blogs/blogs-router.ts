import { Router } from 'express';
import BlogsController from "./blogs-controller";
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator, postContentValidator, postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {validateBlogExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";
import container from "../../container/inversify.config";

const blogsRouter: Router = Router();

const blogsController: BlogsController = container.get<BlogsController>(BlogsController);

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController));

blogsRouter.get('/:id',
    validateBlogExistsMiddleware,
    blogsController.getBlogById.bind(blogsController));

blogsRouter.post('/',
    authAdminMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.createBlog.bind(blogsController));

blogsRouter.get('/:id/posts',
    blogsController.getPostsByBlogId.bind(blogsController));

blogsRouter.post('/:id/posts',
    authAdminMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    blogsController.createPostByBlogId.bind(blogsController));

blogsRouter.put('/:id',
    authAdminMiddleware,
    validateBlogExistsMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.updateBlog.bind(blogsController));

blogsRouter.delete('/:id',
    authAdminMiddleware,
    validateBlogExistsMiddleware,
    blogsController.deleteBlog.bind(blogsController));

export default blogsRouter;