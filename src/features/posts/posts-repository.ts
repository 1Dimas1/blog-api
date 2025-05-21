import { PostDBUpdateType, PostDocument, PostType } from "./post.type";
import {DeleteResult, UpdateResult} from "mongodb";
import {injectable} from "inversify";
import {PostModel} from "./post-model";

@injectable()
export default class PostsRepository {
    async findPostById(id: string): Promise<PostDocument | null> {
        return PostModel.findById(id).exec();
    }

    async createPost(post: PostType): Promise<PostDocument> {
        return PostModel.insertOne(post)
    }

    async updatePost(id: string, post: PostDBUpdateType): Promise<UpdateResult<PostDocument>>  {
        return PostModel.updateOne(
            { _id: id },
            post
        )
    }

    async deletePost(id: string): Promise<DeleteResult> {
        return PostModel.deleteOne({ _id: id })
    }
}