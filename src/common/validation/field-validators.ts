import { body } from 'express-validator'
import {blogsRepository} from "../../features/blogs/blogs-repository";

export const loginUserLoginOrEmailValidator = body('loginOrEmail')
    .isString().notEmpty().trim().withMessage('loginOrEmail is required')

export const loginUserPasswordValidator = body('password')
    .isString().notEmpty().trim().withMessage('password is required')

export const userLoginValidator = body('login')
    .isString().notEmpty().trim().withMessage('login is required')
    .isLength({min: 3, max: 10})
    .withMessage('login should contain 3 - 10 symbols')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login must contain only letters, numbers, underscores, and hyphens')

export const userEmailValidator = body('email')
    .isString().notEmpty().trim().withMessage('email is required')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Invalid email format')

export const userPasswordValidator = body('password')
    .isString().notEmpty().trim().withMessage('password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters long')

export const blogNameValidator = body('name')
    .isString().notEmpty().trim().withMessage('name is required')
    .isLength({min: 1, max: 15})
    .withMessage('name should contain 1 - 15 symbols')

export const blogDescriptionValidator = body('description')
    .isString().notEmpty().trim().withMessage('description is required')
    .isLength({min: 1, max: 500})
    .withMessage('description should contain 1 - 500 symbols')

export const blogWebsiteUrlValidator = body('websiteUrl')
    .isString().notEmpty().trim().withMessage('websiteUrl is required')
    .isLength({min: 1, max: 100})
    .withMessage('websiteUrl should contain 1 - 100 symbols')
    .isURL()
    .withMessage('Invalid URL format')

export const postTitleValidator = body('title')
    .isString().notEmpty().trim().withMessage('title is required')
    .isLength({min: 1, max: 30})
    .withMessage('title should contain 1 - 30 symbols')

export const postShortDescriptionValidator = body('shortDescription')
    .isString().notEmpty().trim().withMessage('shortDescription is required')
    .isLength({min: 1, max: 100})
    .withMessage('shortDescription should contain 1 - 100 symbols')

export const postContentValidator = body('content')
    .isString().notEmpty().trim().withMessage('content is required')
    .isLength({min: 1, max: 1000})
    .withMessage('content should contain 1 - 100 symbols')

export const blogIdValidator = body('blogId')
    .isString().notEmpty().trim().withMessage('blogId is required')
    .custom( async (blogId) =>{
        const blog = await blogsRepository.findBlogById(blogId)
        if (!blog) {
            throw new Error("Blog does not exist")
        }
        return true;
    })