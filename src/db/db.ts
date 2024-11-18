import {DBType} from "../types/db.type";

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