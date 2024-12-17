import {BlogDto, BlogInputDto} from "./blog.test.type";
import {blogTestFactory} from "./blog.test-factory";
import {BlogTestRepository} from "./blog.test-repository";
import {req} from "../test.helpers";


export async function createTestBlog(): Promise<BlogDto> {
    const blogInput = blogTestFactory.createBlogInputDto()
    const res = await new BlogTestRepository(req).createBlog(blogInput)
    return res.body
}

export function expectBlogsToMatch(actual: BlogDto, expected: BlogDto) {
    expect(actual.id).toBe(expected.id)
    expect(actual.name).toBe(expected.name)
    expect(actual.description).toBe(expected.description)
    expect(actual.websiteUrl).toBe(expected.websiteUrl)
    expect(actual.createdAt).toBe(expected.createdAt)
    expect(actual.isMembership).toBe(expected.isMembership)
}

export function expectBlogToMatchInput(blog: BlogDto, input: BlogInputDto) {
    expect(blog.name).toBe(input.name)
    expect(blog.description).toBe(input.description)
    expect(blog.websiteUrl).toBe(input.websiteUrl)
}

export function expectValidBlogShape(blog: BlogDto) {
    expect(typeof blog.id).toBe('string')
    expect(typeof blog.createdAt).toBe('string')
    expect(!isNaN(Date.parse(blog.createdAt))).toBe(true)
    expect(blog.createdAt).toBe(new Date(blog.createdAt).toISOString())
    expect(blog.isMembership).toBe(false)
}

export function expectValidationErrors(body: any, expectedFields: string[]) {
    expect(body.errorsMessages).toHaveLength(expectedFields.length)
    expectedFields.forEach((field, index) => {
        expect(body.errorsMessages[index].field).toBe(field)
    })
}