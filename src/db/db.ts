import {Collection, Db, MongoClient} from "mongodb";
import {BlogDBType} from "../types/blog.type";
import {PostDBType} from "../types/post.type";
import {SETTINGS} from "../settings";
import {UserDBType} from "../types/user.type";

const url = SETTINGS.MONGO_URL

if (!url) {
    throw Error('!!! URL has not been found')
}

const client: MongoClient = new MongoClient(url)
export const database: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogDBType> = database.collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBType> = database.collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME)
export const userCollection: Collection<UserDBType> = database.collection<UserDBType>(SETTINGS.USER_COLLECTION_NAME)

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