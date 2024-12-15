import { Router } from 'express';
import {blogsController} from "./blogs-controller";
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator, postContentValidator, postShortDescriptionValidator,
    postTitleValidator
} from "../../common/validation/field-validators";
import {errorResultMiddleware} from "../../common/middlewares/errors-result-middleware";
import {authorisationMiddleware} from "../auth/authorisation-middleware";
import {validateBlogExistsMiddleware} from "../../common/middlewares/id-params-validation-middleware";

const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id',
    validateBlogExistsMiddleware,
    blogsController.getBlogById);

blogsRouter.post('/',
    authorisationMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.createBlog);

blogsRouter.get('/:id/posts',
    blogsController.getPostsByBlogId);

blogsRouter.post('/:id/posts',
    authorisationMiddleware,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorResultMiddleware,
    blogsController.createPostByBlogId);

blogsRouter.put('/:id',
    authorisationMiddleware,
    validateBlogExistsMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.updateBlog);

blogsRouter.delete('/:id',
    authorisationMiddleware,
    validateBlogExistsMiddleware,
    blogsController.deleteBlog);

export default blogsRouter;