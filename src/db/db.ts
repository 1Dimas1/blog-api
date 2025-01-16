import {Collection, Db, MongoClient} from "mongodb";
import {BlogType} from "../features/blogs/blog.type";
import {PostType} from "../features/posts/post.type";
import {SETTINGS} from "../settings";
import {UserType} from "../features/users/user.type";
import {CommentType} from "../features/comments/comment.type";

const url = SETTINGS.MONGO_URL

if (!url) {
    throw Error('!!! URL has not been found')
}

const client: MongoClient = new MongoClient(url)
export const database: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogType> = database.collection<BlogType>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostType> = database.collection<PostType>(SETTINGS.POST_COLLECTION_NAME)
export const userCollection: Collection<UserType> = database.collection<UserType>(SETTINGS.USER_COLLECTION_NAME)
export const commentCollection: Collection<CommentType> = database.collection<CommentType>(SETTINGS.COMMENT_COLLECTION_NAME)

export const connectToDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
    } catch (e) {
        console.log('Unable to connected to db')
        console.log(e)
        await client.close()
    }
}