import {config} from 'dotenv'
config()

export const SETTINGS = {
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing'
    },
    PORT: process.env.PORT || 3003
}

export enum HTTP_CODES  {
        OK_200 = 200,
        CREATED_201 = 201,
        NO_CONTENT_204 = 204,
        BAD_REQUEST_400 = 400,
        NOT_FOUND_404 = 404
}