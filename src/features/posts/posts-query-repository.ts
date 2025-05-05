import {PostDBType, PostViewType} from "./post.type";
import {postCollection} from "../../db/db";
import {ObjectId, SortDirection} from "mongodb";
import {injectable} from "inversify";


@injectable()
export default class PostsQueryRepository {
    async getPosts(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        filter: any = {}
    ): Promise<PostViewType[]> {
        const posts: PostDBType[] = await postCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return posts.map(this._mapPostToOutput)
    }

    async findPostById(id: string): Promise<PostViewType | null> {
        const post: PostDBType | null = await postCollection.findOne({ _id: new ObjectId(id) });
        return post ? this._mapPostToOutput(post) : null;
    }

    async getPostsCount(filter: any): Promise<number> {
        return postCollection.countDocuments(filter);
    }

    _mapPostToOutput(post: PostDBType): PostViewType {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        };
    }
}