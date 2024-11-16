import {BlogDBType} from "./blog.type";
import {PostDBType} from "./post.type";

export type DBType = {
    blogs: Array<BlogDBType>
    posts: Array<PostDBType>
}