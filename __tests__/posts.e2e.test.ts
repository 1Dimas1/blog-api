import {HTTP_CODES, SETTINGS} from "../src/settings";
import {req} from './test.helpers'
import {createString, getValidCredentials} from "./test.helpers";
import {PostCreateByBlogIdInputType, PostInputType} from "../src/types/post.type";
import {BlogInputType, BlogOutPutType} from "../src/types/blog.type";

let blog: BlogOutPutType;

describe('/posts', () => {
    beforeEach(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)

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

        blog = {
            id: resPost.body.id,
            name: resPost.body.name,
            description: resPost.body.description,
            websiteUrl: resPost.body.websiteUrl,
            createdAt: resPost.body.createdAt,
            isMembership: resPost.body.isMembership
        }
    })
    afterAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204)
    })

    it('GET posts by blog id = []', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.items.length).toBe(0)
    })
    it('GET posts by blog id returns a newly created blogs post', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resGet = await req
            .get(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(resGet.body.items.length).toBe(1)
        expect(resGet.body.items[0].id).toEqual(resPost.body.id)
        expect(resGet.body.items[0].title).toEqual(resPost.body.title)
        expect(resGet.body.items[0].shortDescription).toEqual(resPost.body.shortDescription)
        expect(resGet.body.items[0].content).toEqual(resPost.body.content)
        expect(resGet.body.items[0].blogId).toEqual(resPost.body.blogId)
        expect(resGet.body.items[0].blogName).toEqual(resPost.body.blogName)
        expect(resGet.body.items[0].createdAt).toEqual(resPost.body.createdAt)
    })
    it('- GET posts by not existing blog id 404', async () => {
        const id: string = '67462ce1b0650d27e4ecfcf6'

        const res = await req
            .get(SETTINGS.PATH.BLOGS +`/${id}` + SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.NOT_FOUND_404)

    })
    it('+ POST should create post by blog id', async () => {
        const newPost: PostCreateByBlogIdInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const createdAt = res.body.createdAt
        const isValidDate = !isNaN(Date.parse(createdAt)) && createdAt === new Date(createdAt).toISOString()

        expect(typeof res.body.id).toEqual('string')
        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(blog.id)
        expect(res.body.blogName).toEqual(blog.name)
        expect(isValidDate).toBe(true)
    })
    it('- POST shouldn\'t create a post by blog id 401', async () => {
        const newPost: PostCreateByBlogIdInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
        }

        await req
            .post(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- POST shouldn\'t a post by blog id create 400', async () => {
        const newPost: PostCreateByBlogIdInputType = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')

        const resGet = await req.get(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- POST shouldn\'t create a post by not existing blog id 404', async () => {
        const newPost: PostCreateByBlogIdInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
        }

        const id: string = '67462ce1b0650d27e4ecfcf6'

        await req
            .post(SETTINGS.PATH.BLOGS +`/${id}` + SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.BLOGS +`/${blog.id.toString()}` + SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })

    it('GET posts = []', async () => {
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(res.body.items.length).toBe(0)
    })
    it('GET posts returns a newly created post', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resGet = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_CODES.OK_200)

        expect(resGet.body.items.length).toBe(1)
        expect(resGet.body.items[0].id).toEqual(resPost.body.id)
        expect(resGet.body.items[0].title).toEqual(resPost.body.title)
        expect(resGet.body.items[0].shortDescription).toEqual(resPost.body.shortDescription)
        expect(resGet.body.items[0].content).toEqual(resPost.body.content)
        expect(resGet.body.items[0].blogId).toEqual(resPost.body.blogId)
        expect(resGet.body.items[0].blogName).toEqual(resPost.body.blogName)
        expect(resGet.body.items[0].createdAt).toEqual(resPost.body.createdAt)
    })
    it('- GET post by ID with incorrect ID 404', async () => {
        const id: string = '67462ce1b0650d27e4ecfcf6'

        await req
            .get(SETTINGS.PATH.POSTS.concat(`/${id}`))
            .expect(HTTP_CODES.NOT_FOUND_404)
    })
    it('+ GET post by ID with correct ID', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resGet = await req
            .get(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .expect(HTTP_CODES.OK_200)

        expect(resGet.body.id).toEqual(resPost.body.id)
        expect(resGet.body.title).toEqual(resPost.body.title)
        expect(resGet.body.shortDescription).toEqual(resPost.body.shortDescription)
        expect(resGet.body.content).toEqual(resPost.body.content)
        expect(resGet.body.blogId).toEqual(resPost.body.blogId)
        expect(resGet.body.blogName).toEqual(resPost.body.blogName)
        expect(resGet.body.createdAt).toEqual(resPost.body.createdAt)
    })
    it('+ POST should create', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const createdAt = res.body.createdAt
        const isValidDate = !isNaN(Date.parse(createdAt)) && createdAt === new Date(createdAt).toISOString()

        expect(typeof res.body.id).toEqual('string')
        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(blog.id)
        expect(res.body.blogName).toEqual(blog.name)
        expect(isValidDate).toBe(true)
    })
    it('- POST shouldn\'t create 401', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- POST shouldn\'t create 400', async () => {
        const newPost: PostInputType = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '67462ce1b0650d27e4ecfcf6',
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('blogId')
        expect(res.body.errorsMessages[1].field).toEqual('title')
        expect(res.body.errorsMessages[2].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[3].field).toEqual('content')

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('+ DELETE should del', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(0)
    })
    it('- DELETE shouldn\'t del 404', async () => {
        const id: string = '67462ce1b0650d27e4ecfcf6'

        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.POSTS.concat(`/${id}`))
            .set({'Authorization': getValidCredentials()})
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(1)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- DELETE shouldn\'t del 401', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resDelete = await req
            .delete(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': 'invalid credentials'}) // no ' '
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items.length).toEqual(1)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('+ PUT should update', async () => {
        const newBlogForPostUpdate: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPostBlog = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlogForPostUpdate)
            .expect(HTTP_CODES.CREATED_201)

        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const postDataToUpdate: PostInputType = {
            title: 'new title',
            content: 'content new',
            shortDescription: 'short description new',
            blogId: resPostBlog.body.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .send(postDataToUpdate)
            .expect(HTTP_CODES.NO_CONTENT_204)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items[0]).toEqual({...resGet.body.items[0], ...postDataToUpdate, blogName: resPostBlog.body.name})
    })
    it('- PUT shouldn\'t update 404', async () => {
        const newBlogForPostUpdate: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPostBlog = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlogForPostUpdate)
            .expect(HTTP_CODES.CREATED_201)

        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const postDataToUpdate: PostInputType = {
            title: 'new title',
            content: 'content new',
            shortDescription: 'short description new',
            blogId: resPostBlog.body.id.toString(),
        }

        const id: string = '67462ce1b0650d27e4ecfcf6'

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.POSTS.concat(`/${id}`))
            .set({'Authorization': getValidCredentials()})
            .send(postDataToUpdate)
            .expect(HTTP_CODES.NOT_FOUND_404)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items[0]).not.toEqual({...resGet.body.items[0], ...postDataToUpdate, blogName: resPostBlog.body.name})
    })
    it('- PUT shouldn\'t update 400', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const id: string = '67462ce1b0650d27e4ecfcf6'

        const postDataToUpdate: PostInputType = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: id,
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': getValidCredentials()})
            .send(postDataToUpdate)
            .expect(HTTP_CODES.BAD_REQUEST_400)

        expect(resPut.body.errorsMessages.length).toEqual(4)
        expect(resPut.body.errorsMessages[0].field).toEqual('blogId')
        expect(resPut.body.errorsMessages[1].field).toEqual('title')
        expect(resPut.body.errorsMessages[2].field).toEqual('shortDescription')
        expect(resPut.body.errorsMessages[3].field).toEqual('content')

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- PUT shouldn\'t update with valid post input data 401', async () => {
        const newBlogForPostUpdate: BlogInputType = {
            name: 'blog name',
            description: 'blog description',
            websiteUrl: 'http://someValidUrl.com',
        }

        const resPostBlog = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': getValidCredentials()})
            .send(newBlogForPostUpdate)
            .expect(HTTP_CODES.CREATED_201)

        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const postDataToUpdate: PostInputType = {
            title: 'new title',
            content: 'content new',
            shortDescription: 'short description new',
            blogId: resPostBlog.body.id.toString(),
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': 'invalid credentials'})
            .send(postDataToUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
    it('- PUT shouldn\'t update with invalid post input data 401', async () => {
        const newPost: PostInputType = {
            title: 'title',
            content: 'content',
            shortDescription: 'short description',
            blogId: blog.id.toString(),
        }

        const id: string = '67462ce1b0650d27e4ecfcf6'

        const postDataToUpdate: PostInputType = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: id,
        }

        const resPost = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': getValidCredentials()})
            .send(newPost)
            .expect(HTTP_CODES.CREATED_201)

        const resPut = await req
            .put(SETTINGS.PATH.POSTS.concat(`/${resPost.body.id}`))
            .set({'Authorization': 'invalid credentials'})
            .send(postDataToUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED_401)

        const resGet = await req.get(SETTINGS.PATH.POSTS)
        expect(resGet.body.items[0]).toEqual(resPost.body)
    })
})