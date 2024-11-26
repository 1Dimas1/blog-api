import {DBType} from "../types/db.type";
import { MongoClient, Db, Collection} from "mongodb";
import {BlogDBType} from "../types/blog.type";
import {PostDBType} from "../types/post.type";
import {SETTINGS} from "../settings";

export const db: DBType = {
    blogs: [],
    posts: []
}

export const setDB = (dataset?: DBType) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        return
    }
    db.blogs = dataset.blogs?.map(b => ({...b})) || db.blogs
    db.posts = dataset.posts?.map(p => ({...p})) || db.posts
}


const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const database: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogDBType> = database.collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBType> = database.collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME)

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