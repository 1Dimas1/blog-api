import {postCollection} from "../../db/db";
import {PostDBType, PostDBUpdateType, PostType} from "./post.type";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {injectable} from "inversify";

@injectable()
export default class PostsRepository {
    async findPostById(id: string): Promise<PostDBType | null> {
        return postCollection.findOne({_id: new ObjectId(id)});
    }

    async createPost(post: PostType): Promise<InsertOneResult<PostDBType>> {
        return postCollection.insertOne(post)
    }

    async updatePost(id: string, post: PostDBUpdateType): Promise<UpdateResult<PostDBType>>  {
        return postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
    }

    async deletePost(id: string): Promise<DeleteResult> {
        return postCollection.deleteOne({_id: new ObjectId(id)})
    }
}