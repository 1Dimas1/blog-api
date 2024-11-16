import { body } from 'express-validator'
import {blogsRepository} from "../repositories/blogs-repository";

const urlPattern = '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/';

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
    .matches(urlPattern)
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
    .custom(blogId =>{
        const blog = blogsRepository.findBlogById(blogId)
        return blog!!
    })
    .withMessage('Blog does not exist')