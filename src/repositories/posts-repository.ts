import {postCollection} from "../db/db";
import {PostDBType, PostInputType, PostOutPutType} from "../types/post.type";
import {blogsRepository} from "./blogs-repository";
import {ObjectId} from "mongodb";
import {BlogDBType} from "../types/blog.type";

export const postsRepository = {
    async getPosts():  Promise<PostDBType[]> {
        return postCollection.find({}).toArray();
    },
    async createPost(body: PostInputType): Promise<PostOutPutType | null> {
        const postsBlog: BlogDBType | null = await blogsRepository.findBlogById(body.blogId)
        if (!postsBlog) { return null }
        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: postsBlog._id,
            blogName: postsBlog.name,
            createdAt: new Date().toISOString()
        }
        const result = await postCollection.insertOne(post)
        return this.mapToOutput(post)
    },
    async updatePost(id: string, body: PostInputType)  {
        const post = {
            title : body.title,
            shortDescription : body.shortDescription,
            content : body.content,
            blogId : new ObjectId(body.blogId)
        }
        return postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
    },
    async findPostById(id: string): Promise<PostDBType | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    },
    async deletePost(id: string) {
        return postCollection.deleteOne({_id: new ObjectId(id)})
    },
    mapToOutput(post: PostDBType): PostOutPutType {  //mapping can be moved to another repository object
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}