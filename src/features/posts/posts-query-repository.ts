import {PostDocument, PostViewType} from "./post.type";
import {SortDirection} from "mongodb";
import {injectable} from "inversify";
import {PostModel} from "./post-model";


@injectable()
export default class PostsQueryRepository {
    async getPosts(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        filter: any = {}
    ): Promise<PostViewType[]> {
        const posts: PostDocument[] = await PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        return posts.map(this._mapPostToOutput)
    }

    async findPostById(id: string): Promise<PostViewType | null> {
        const post: PostDocument | null = await PostModel.findById(id).exec();
        return post ? this._mapPostToOutput(post) : null;
    }

    async getPostsCount(filter: any): Promise<number> {
        return PostModel.countDocuments(filter).exec();
    }

    _mapPostToOutput(post: PostDocument): PostViewType {
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