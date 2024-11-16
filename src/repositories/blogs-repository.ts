import {BlogDBType, BlogInputType, BlogOutPutType} from "../types/blog.type";
import {db} from "../db/db";

export const blogsRepository = {
    getBlogsForOutPut(): Array<BlogOutPutType> {
        return db.blogs.map(blogsRepository.mapToOutput);
    },
    createBlog(body: BlogInputType): BlogOutPutType {
        const blog: BlogDBType = {
            id: new Date().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        db.blogs.push(blog)
        return this.mapToOutput(blog)
    },
    updateBlog(blog: BlogDBType, body: BlogInputType) {
        blog.name = body.name;
        blog.description = body.description;
        blog.websiteUrl = body.websiteUrl;
    },
    findBlogById(id: string): BlogDBType | undefined {
        const blog: BlogDBType | undefined = db.blogs.find(b => b.id === id)
        return blog;
    },
    deleteBlog(id: string){
        db.blogs = db.blogs.filter(b => b.id !== id)
    },
    mapToOutput(blog: BlogDBType): BlogOutPutType { //mapping can be moved to another repository object
        return {
             id: blog.id,
             name: blog.name,
             description: blog.description,
             websiteUrl: blog.websiteUrl
        }
    }
}