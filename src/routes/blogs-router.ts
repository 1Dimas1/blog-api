import { Router } from 'express';
import {blogsController} from "../controllers/blogs-controller";
import {blogDescriptionValidator, blogNameValidator, blogWebsiteUrlValidator} from "../validation/field-validators";
import {errorResultMiddleware} from "../midlewares/errors-result-middleware";
import {authorisationMiddleware} from "../midlewares/authorisation-middleware";
import {validateBlogExistsMiddleware} from "../midlewares/id-params-validation-middleware";

const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);

blogsRouter.get('/:id',
    validateBlogExistsMiddleware,
    // @ts-ignore
    blogsController.getBlogById);

blogsRouter.post('/',
    authorisationMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    blogsController.createBlog);

blogsRouter.put('/:id',
    authorisationMiddleware,
    validateBlogExistsMiddleware,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorResultMiddleware,
    // @ts-ignore
    blogsController.updateBlog);

blogsRouter.delete('/:id',
    authorisationMiddleware,
    validateBlogExistsMiddleware,
    // @ts-ignore
    blogsController.deleteBlog);

export default blogsRouter;