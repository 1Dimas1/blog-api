import { Router } from 'express';
import {blogsController} from "./blogs-controller";
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator, postContentValidator, postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authAdminMiddleware} from "../auth/auth-admin-middleware";
import {validateBlogExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";

const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id',
    validateBlogExistsMiddleware,
    blogsController.getBlogById);

blogsRouter.post('/',
    authAdminMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.createBlog);

blogsRouter.get('/:id/posts',
    blogsController.getPostsByBlogId);

blogsRouter.post('/:id/posts',
    authAdminMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    blogsController.createPostByBlogId);

blogsRouter.put('/:id',
    authAdminMiddleware,
    validateBlogExistsMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.updateBlog);

blogsRouter.delete('/:id',
    authAdminMiddleware,
    validateBlogExistsMiddleware,
    blogsController.deleteBlog);

export default blogsRouter;