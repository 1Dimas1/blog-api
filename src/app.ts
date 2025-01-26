import express from 'express'
import {SETTINGS} from "./settings";
import testingRouter from "./features/testing/testing.routes";
import blogsRouter from "./features/blogs/blogs-router";
import postsRouter from "./features/posts/posts-router";
import usersRouter from "./features/users/users-router";
import authRouter from "./features/auth/auth-router";
import {HTTP_CODES} from "./common/http.statuses";
import commentsRouter from "./features/comments/comments-router";
import cookieParser from "cookie-parser";

export const app = express()
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(HTTP_CODES.OK_200).json({version: '7.0'})
})

app.use(SETTINGS.PATH.BLOGS,blogsRouter);
app.use(SETTINGS.PATH.POSTS,postsRouter);
app.use(SETTINGS.PATH.USERS,usersRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);