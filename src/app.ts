import express from 'express'
import {HTTP_CODES, SETTINGS} from "./settings";
import testingRouter from "./routes/testing.routes";
import blogsRouter from "./routes/blogs-router";
import postsRouter from "./routes/posts-router";
import usersRouter from "./routes/users-router";

export const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.status(HTTP_CODES.OK_200).json({version: '2.0'})
})

app.use(SETTINGS.PATH.BLOGS,blogsRouter);
app.use(SETTINGS.PATH.POSTS,postsRouter);
app.use(SETTINGS.PATH.USERS,usersRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);