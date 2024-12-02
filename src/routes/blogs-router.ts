import { Router } from 'express';
import {blogsController} from "../controllers/blogs-controller";
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator, postContentValidator, postShortDescriptionValidator,
    postTitleValidator
} from "../validation/field-validators";
import {errorResultMiddleware} from "../midlewares/errors-result-middleware";
import {authorisationMiddleware} from "../midlewares/authorisation-middleware";
import {validateBlogExistsMiddleware} from "../midlewares/id-params-validation-middleware";

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

blogsRouter.get('/:blogId/posts',
    blogsController.getPostsByBlogId);

blogsRouter.post('/:blogId/posts',
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