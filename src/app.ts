import express from 'express'
import {SETTINGS} from "./settings";
import testingRouter from "./features/testing/testing.routes";
import blogsRouter from "./features/blogs/blogs-router";
import postsRouter from "./features/posts/posts-router";
import usersRouter from "./features/users/users-router";
import {authController} from "./features/auth/auth-controller";
import authRouter from "./features/auth/auth-router";
import {HTTP_CODES} from "./common/http.statuses";

export const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.status(HTTP_CODES.OK_200).json({version: '2.0'})
})

app.use(SETTINGS.PATH.BLOGS,blogsRouter);
app.use(SETTINGS.PATH.POSTS,postsRouter);
app.use(SETTINGS.PATH.USERS,usersRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);