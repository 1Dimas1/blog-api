import {HTTP_CODES, SETTINGS} from "../src/settings";
import {req} from './test.helpers'
import {createString, getValidCredentials} from "./test.helpers";
import {BlogInputType} from "../src/types/blog.type";

describe('/blogs', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)
    })
    afterAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)
    })

    it('GET blogs = []', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.items.length).toBe(0)
    })
    it('GET blogs returns a newly created blog', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resGet = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_CODES.OK_200)

        expect(resGet.body.items.length).toBe(1)
        expect(resGet.body.items[0].id).toEqual(resPost.body.id)
        expect(resGet.body.items[0].name).toEqual(resPost.body.name)
        expect(resGet.body.items[0].description).toEqual(resPost.body.description)
        expect(resGet.body.items[0].websiteUrl).toEqual(resPost.body.websiteUrl)
        expect(resGet.body.items[0].createdAt).toEqual(resPost.body.createdAt)
        expect(resGet.body.items[0].isMembership).toEqual(resPost.body.isMembership)
    })
    it('- GET blog by ID with incorrect ID 404', async () => {
        const id: string = '67462ce1b0650d27e4ecfcf6'

        const res = await req
            .get(SETTINGS.PATH.BLOGS.concat(`/${id}`))
            .expect(HTTP_CODES.NOT_FOUND_404)
    })
    it('+ GET blog by ID with correct ID', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resGet = await req
            .get(SETTINGS.PATH.BLOGS.concat(`/${resPost.body.id}`))
            .expect(HTTP_CODES.OK_200)

        expect(resPost.body.id).toEqual(resGet.body.id)
        expect(resPost.body.name).toEqual(resGet.body.name)
        expect(resPost.body.description).toEqual(resGet.body.description)
        expect(resPost.body.websiteUrl).toEqual(resGet.body.websiteUrl)
        expect(resGet.body.createdAt).toEqual(resPost.body.createdAt)
        expect(resGet.body.isMembership).toEqual(resPost.body.isMembership)
    })
    it('+ POST should create a blog', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const createdAt = res.body.createdAt
        const isValidDate = !isNaN(Date.parse(createdAt)) && createdAt === new Date(createdAt).toISOString()

        expect(typeof res.body.id).toEqual('string')
        expect(res.body.name).toEqual(newBlog.name)
        expect(res.body.description).toEqual(newBlog.description)
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl)
        expect(isValidDate).toBe(true)
        expect(res.body.isMembership).toBe(false)
    })
    it('- POST shouldn\'t create 401', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- POST shouldn\'t create 400', async () => {
        const newBlog: BlogInputType = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(resPost.body.errorsMessages.length).toEqual(3)
        expect(resPost.body.errorsMessages[0].field).toEqual('name')
        expect(resPost.body.errorsMessages[1].field).toEqual('description')
        expect(resPost.body.errorsMessages[2].field).toEqual('websiteUrl')

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('+ DELETE should del', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.BLOGS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- DELETE shouldn\'t del 404', async () => {
        const id: string = '67462ce1b0650d27e4ecfcf6'

        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.BLOGS.concat(`/${id}`))
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items.length).toEqual(1)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- DELETE shouldn\'t del 401', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.BLOGS.concat(`/${resPost.body.id}`))
            .set({'Authorization': 'invalid credentials'})
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items.length).toEqual(1)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('+ PUT should update', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const blogDataToUpdate: BlogInputType = {
            name: 'name updated',
            description: 'blog description updated',
            websiteUrl: 'http://someUrlUpdated.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.BLOGS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .send(blogDataToUpdate)
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items[0]).toEqual({...resGet.body.items[0], ...blogDataToUpdate})
    })
    it('- PUT shouldn\'t update 404', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const id: string = '67462ce1b0650d27e4ecfcf6'

        const blogDataToUpdate: BlogInputType = {
            name: 'name updated',
            description: 'blog description updated',
            websiteUrl: 'http://someUrlUpdated.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.BLOGS.concat(`/${id}`))
            .set({'Authorization': getValidCredentials()})
            .send(blogDataToUpdate)
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items[0]).not.toEqual({...resGet.body.items[0], ...blogDataToUpdate})
    })
    it('- PUT shouldn\'t update 400', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const blogDataToUpdate: BlogInputType = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.BLOGS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .send(blogDataToUpdate)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(resPut.body.errorsMessages.length).toEqual(3)
        expect(resPut.body.errorsMessages[0].field).toEqual('name')
        expect(resPut.body.errorsMessages[1].field).toEqual('description')
        expect(resPut.body.errorsMessages[2].field).toEqual('websiteUrl')

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- PUT shouldn\'t update with valid blog input data 401', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const blogDataToUpdate: BlogInputType = {
            name: 'name updated',
            description: 'blog description updated',
            websiteUrl: 'http://someUrlUpdated.com',
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.BLOGS + '/' + resPost.body.id)
            .set({'Authorization': 'invalid credentials'})
            .send(blogDataToUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- PUT shouldn\'t update with invalid blog input data 401', async () => {
        const newBlog: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const blogDataToUpdate: BlogInputType = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)
        }

        const resPost = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlog)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.BLOGS + '/' + resPost.body.id)
            .set({'Authorization': 'invalid credentials'})
            .send(blogDataToUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
})