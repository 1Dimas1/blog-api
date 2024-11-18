import {SETTINGS} from "../src/settings";
import {BlogDBType, BlogInputType} from "../src/types/blog.type";
import {DBType} from "../src/types/db.type";
import {PostDBType, PostInputType} from "../src/types/post.type";

export const getValidCredentials = () => {
    const credentials = `${SETTINGS.CREDENTIALS.LOGIN}:${SETTINGS.CREDENTIALS.PASSWORD}`
    const base64credentials = Buffer.from(credentials).toString('base64')
    const validAuthValue = `Basic ${base64credentials}`
    return validAuthValue;
}

export const createString = (length: number) => {
    let s = ''
    for (let x = 1; x <= length; x++) {
        s += x % 10
    }
    return s
}

export const validBlog: BlogInputType = {
    name: 'blog name',
    description: 'blog description',
    websiteUrl: 'http://someAnotherUrl.com',
} as const

export const invalidBlog: BlogInputType = {
    name: createString(16),
    description: createString(501),
    websiteUrl: createString(101)
} as const

export const blog: BlogDBType = {
    id: '666',
    name: 'name_name',
    description: 'description_description',
    websiteUrl: 'http://someUrl.com',
} as const

export const validPost: PostInputType = {
    title: 'post title',
    content: 'post content',
    shortDescription: 'post short description',
    blogId: blog.id,
} as const

export const invalidPost: PostInputType = {
    title: createString(31),
    content: createString(1001),
    shortDescription: createString(101),
    blogId: '777',
} as const

export const post: PostDBType = {
    id: '999',
    title: 'title_title',
    content: 'content_content',
    shortDescription: 'post_short_description',
    blogId: blog.id,
    blogName: blog.name
} as const


export const datasetWithBlog: DBType = {
    blogs: [blog],
    posts: [],
} as const

export const datasetWithBlogAndPost: DBType = {
    blogs: [blog],
    posts: [post],
} as const