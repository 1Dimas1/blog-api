import {config} from 'dotenv'
config()

export const SETTINGS = {
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        TESTING: '/testing'
    },
    CREDENTIALS: {
        LOGIN: 'admin',
        PASSWORD: 'qwerty'
    },
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    BLOG_COLLECTION_NAME: 'blogs',
    POST_COLLECTION_NAME: 'posts',
    USER_COLLECTION_NAME: 'users'
}

export enum HTTP_CODES  {
        OK_200 = 200,
        CREATED_201 = 201,
        NO_CONTENT_204 = 204,
        BAD_REQUEST_400 = 400,
        UNAUTHORIZED_401 = 401,
        NOT_FOUND_404 = 404,
        INTERNAL_SERVER_ERROR_500 = 500,
}
