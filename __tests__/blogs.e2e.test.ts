import {HTTP_CODES, SETTINGS} from "../src/settings";
import {req} from './test.helpers'
import {datasetWithBlog, datasetWithBlogAndPost, getValidCredentials, invalidBlog, validBlog} from "./datasets";
import {BlogDBType, BlogInputType} from "../src/types/blog.type";
import {db, setDB} from "../src/db/db";

describe('/blogs', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(204)
    })

    it('GET blogs = []', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.length).toBe(0)
    })
    it('GET blogs = datasetWithBlog.blogs', async () => {
        setDB(datasetWithBlog)

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_CODES.OK_200)


        expect(res.body.length).toEqual(datasetWithBlog.blogs.length)
        expect(res.body).toEqual(datasetWithBlog.blogs)
    })
    it('- GET blog by ID with incorrect ID', async () => {
        setDB(datasetWithBlog)

        const res = await req
            .get(SETTINGS.PATH.BLOGS.concat('/123'))
            .expect(HTTP_CODES.NOT_FOUND_404)
    })
    it('+ GET blog by ID with correct ID', async () => {
        setDB(datasetWithBlog)
        const blog: BlogDBType = datasetWithBlog.blogs[0]

        await req
            .get(SETTINGS.PATH.BLOGS + '/' + blog.id)
            .expect(HTTP_CODES.OK_200, blog)
    })
    it('+ POST should create', async () => {
        const newBlog: BlogInputType = validBlog

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        expect(resPost.body.name).toEqual(newBlog.name)
        expect(resPost.body.description).toEqual(newBlog.description)
        expect(resPost.body.websiteUrl).toEqual(newBlog.websiteUrl)
        expect(typeof resPost.body.id).toEqual('string')

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(1)
        expect(resPost.body).toEqual(resGet.body[0])
    })
    it('- POST shouldn\'t create 401', async () => {
        const newBlog: BlogInputType = validBlog

        await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(0)
    })
    it('- POST shouldn\'t create', async () => {
        const newBlog: BlogInputType = invalidBlog

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(400)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(0)
    })
    it('+ DELETE should del', async () => {
        setDB(datasetWithBlog)
        const blog: BlogDBType = datasetWithBlog.blogs[0]

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + blog.id)
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(0)
    })
    it('- DELETE shouldn\'t del', async () => {
        setDB(datasetWithBlog)

        await req
            .delete(SETTINGS.PATH.BLOGS + '/123')
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(1)
        expect(resGet.body[0]).toEqual(datasetWithBlog.blogs[0])
    })
    it('- DELETE shouldn\'t del 401', async () => {
        setDB(datasetWithBlog)
        const blog: BlogDBType = datasetWithBlog.blogs[0]

        await req
            .delete(SETTINGS.PATH.BLOGS + '/' + blog.id)
            .set({'Authorization': 'invalid credentials'})
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.length).toEqual(1)
        expect(resGet.body[0]).toEqual(datasetWithBlog.blogs[0])
    })
    it('+ PUT should update', async () => {
        setDB(datasetWithBlog)
        const blog: BlogInputType = validBlog

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + datasetWithBlog.blogs[0].id)
            .set({'Authorization': getValidCredentials()})
            .send(blog)
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body[0]).toEqual({...resGet.body[0], ...blog})
    })
    it('- PUT shouldn\'t update 404', async () => {
        setDB(datasetWithBlog)
        const blog: BlogInputType = validBlog

        await req
            .put(SETTINGS.PATH.BLOGS + '/1010')
            .set({'Authorization': getValidCredentials()})
            .send(blog)
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body[0]).not.toEqual({...resGet.body[0], ...blog})
    })
    it('- PUT shouldn\'t update', async () => {
        setDB(datasetWithBlog)
        const blog: BlogInputType = invalidBlog

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + datasetWithBlog.blogs[0].id)
            .set({'Authorization': getValidCredentials()})
            .send(blog)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body[0]).toEqual(datasetWithBlog.blogs[0])
    })
    it('- PUT shouldn\'t update with valid blog input data 401', async () => {
        setDB(datasetWithBlog)
        const blog: BlogInputType = validBlog

        await req
            .put(SETTINGS.PATH.BLOGS + '/' + datasetWithBlog.blogs[0].id)
            .set({'Authorization': 'invalid credentials'})
            .send(blog)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body[0]).toEqual(datasetWithBlog.blogs[0])
    })
    it('- PUT shouldn\'t update with invalid blog input data 401', async () => {
        setDB(datasetWithBlog)
        const blog: BlogInputType = invalidBlog

        await req
            .put(SETTINGS.PATH.BLOGS + '/' + datasetWithBlog.blogs[0].id)
            .set({'Authorization': 'invalid credentials'})
            .send(blog)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body[0]).toEqual(datasetWithBlog.blogs[0])
    })
})