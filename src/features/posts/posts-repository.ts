import {postCollection} from "../../db/db";
import {PostDBType, PostDBUpdateType, PostType, PostViewType} from "./post.type";
import {DeleteResult, InsertOneResult, ObjectId, SortDirection, UpdateResult} from "mongodb";

export const postsRepository = {
    async findPostById(id: string): Promise<PostDBType | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    },

    async createPost(post: PostType): Promise<InsertOneResult<PostDBType>> {
        return postCollection.insertOne(post)
    },

    async updatePost(id: string, post: PostDBUpdateType): Promise<UpdateResult<PostDBType>>  {
        return postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
    },

    async deletePost(id: string): Promise<DeleteResult> {
        return postCollection.deleteOne({_id: new ObjectId(id)})
    },
}