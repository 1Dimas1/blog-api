import {db} from "../db/db";
import {PostDBType, PostInputType, PostOutPutType} from "../types/post.type";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    getPostsForOutPut():  Array<PostOutPutType> {
        return db.posts.map(postsRepository.mapToOutput);
    },
    createPost(body: PostInputType): PostOutPutType | undefined {
        const postsBlog = blogsRepository.findBlogById(body.blogId)
        if (!postsBlog) { return undefined }
        const post: PostDBType = {
            id: new Date().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: postsBlog.name,
        }
        db.posts.push(post)
        return this.mapToOutput(post)
    },
    updatePost(post: PostDBType, body: PostInputType)  {
        post.title = body.title
        post.shortDescription = body.shortDescription
        post.content = body.content
        post.blogId = body.blogId;

    },
    findPostById(id: string): PostDBType | undefined {
        const post: PostDBType | undefined = db.posts.find(p => p.id === id)
        return post;
    },

    deletePost(id: string) {
        db.posts = db.posts.filter(p => p.id !== id)
    },
    mapToOutput(post: PostDBType): PostOutPutType {  //mapping can be moved to another repository object
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName
        }
    }
}