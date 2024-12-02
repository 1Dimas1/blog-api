import {blogCollection, postCollection} from "../db/db";
import {PostDBType, PostDBUpdateType, PostInputType, PostOutPutType} from "../types/post.type";
import {DeleteResult, InsertOneResult, ObjectId, SortDirection, UpdateResult} from "mongodb";

export const postsRepository = {
    async getPosts(
        sortBy: string,
        sortDirection: SortDirection ,
        pageNumber: number,
        pageSize: number,
    ):  Promise<PostDBType[]> {
        return postCollection
            .find({})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async createPost(post: PostDBType): Promise<InsertOneResult<PostDBType | null>> {
        return postCollection.insertOne(post)
    },
    async updatePost(id: string, post: PostDBUpdateType): Promise<UpdateResult<PostDBType>>  {
        return postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
    },
    async findPostById(id: string): Promise<PostDBType | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    },
    async getPostsCount():Promise<number> {
        return blogCollection.countDocuments();
    },
    async deletePost(id: string): Promise<DeleteResult> {
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