import {HTTP_CODES, SETTINGS} from "../src/settings";
import {req} from './test.helpers'
import {setDB} from "../src/db/db";
import {datasetWithBlog, datasetWithBlogAndPost, getValidCredentials, invalidPost, validPost} from "./datasets";
import {PostDBType, PostInputType} from "../src/types/post.type";

describe('/blogs', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(204)
    })

    it('GET posts = []', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.length).toBe(0)
    })
    it('GET posts = datasetWithBlogAndPost.posts', async () => {
        setDB(datasetWithBlogAndPost)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.length).toEqual(datasetWithBlogAndPost.posts.length)
        expect(res.body).toEqual(datasetWithBlogAndPost.posts)
    })
    it('- GET post by ID with incorrect ID', async () => {
        setDB(datasetWithBlogAndPost)

        const res = await req
            .get(SETTINGS.PATH.POSTS.concat('/123'))
            .expect(HTTP_CODES.NOT_FOUND_404)
    })
    it('+ GET post by ID with correct ID', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostDBType = datasetWithBlogAndPost.posts[0]

        await req
            .get(SETTINGS.PATH.POSTS + '/' + post.id)
            .expect(HTTP_CODES.OK_200, post)
    })
    it('+ POST should create', async () => {
        setDB(datasetWithBlog)
        const newPost: PostInputType = validPost

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        expect(resPost.body.title).toEqual(newPost.title)
        expect(resPost.body.shortDescription).toEqual(newPost.shortDescription)
        expect(resPost.body.content).toEqual(newPost.content)
        expect(resPost.body.blogId).toEqual(newPost.blogId)
        expect(resPost.body.blogName).toEqual(datasetWithBlog.blogs[0].name)
        expect(typeof resPost.body.id).toEqual('string')

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(1)
        expect(resPost.body).toEqual(resGet.body[0])
    })
    it('- POST shouldn\'t create 401', async () => {
        setDB(datasetWithBlog)
        const newPost: PostInputType = validPost

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(0)
    })
    it('- POST shouldn\'t create', async () => {
        const newPost: PostInputType = invalidPost

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(0)
    })
    it('+ DELETE should del', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostDBType = datasetWithBlogAndPost.posts[0]

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + post.id)
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(0)
    })
    it('- DELETE shouldn\'t del', async () => {
        setDB(datasetWithBlogAndPost)

        await req
            .delete(SETTINGS.PATH.POSTS + '/0101')
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(1)
        expect(resGet.body[0]).toEqual(datasetWithBlogAndPost.posts[0])
    })
    it('- DELETE shouldn\'t del 401', async () => {
        setDB(datasetWithBlogAndPost)

        await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'invalid credentials'}) // no ' '
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.length).toEqual(1)
        expect(resGet.body[0]).toEqual(datasetWithBlogAndPost.posts[0])
    })
    it('+ PUT should update', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostInputType = validPost

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + datasetWithBlogAndPost.posts[0].id)
            .set({'Authorization': getValidCredentials()})
            .send(post)
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body[0]).toEqual({...resGet.body[0], ...post, blogName: datasetWithBlogAndPost.blogs[0].name})
    })
    it('- PUT shouldn\'t update 404', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostInputType = validPost

        await req
            .put(SETTINGS.PATH.POSTS + '/0101')
            .set({'Authorization': getValidCredentials()})
            .send(post)
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body[0]).not.toEqual({...resGet.body[0], ...post, blogName: datasetWithBlogAndPost.blogs[0].name})
    })
    it('- PUT shouldn\'t update', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostInputType = invalidPost

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + datasetWithBlogAndPost.posts[0].id)
            .set({'Authorization': getValidCredentials()})
            .send(post)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body[0]).toEqual(datasetWithBlogAndPost.posts[0])
    })
    it('- PUT shouldn\'t update with valid post input data 401', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostInputType = validPost

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + datasetWithBlogAndPost.posts[0].id)
            .set({'Authorization': 'invalid credentials'})
            .send(post)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body[0]).toEqual(datasetWithBlogAndPost.posts[0])
    })
    it('- PUT shouldn\'t update with invalid post input data 401', async () => {
        setDB(datasetWithBlogAndPost)
        const post: PostInputType = invalidPost

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + datasetWithBlogAndPost.posts[0].id)
            .set({'Authorization': 'invalid credentials'})
            .send(post)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body[0]).toEqual(datasetWithBlogAndPost.posts[0])
    })
})