import {config} from 'dotenv'

config()

export const SETTINGS = {
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS: '/comments',
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
    USER_COLLECTION_NAME: 'users',
    COMMENT_COLLECTION_NAME: 'comments',
    INVALID_TOKENS_COLLECTION_NAME : 'invalidTokens',
    EMAIL_CONFIRMATION_CODE_EXP_DATE_24_H: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}