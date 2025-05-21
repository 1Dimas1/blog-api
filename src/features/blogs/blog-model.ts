import mongoose from "mongoose";
import { BlogModelType, BlogType} from "./blog.type";
import {SETTINGS} from "../../settings";
import {blogSchema} from "./blog-schema";

export const BlogModel: BlogModelType = mongoose.model<BlogType, BlogModelType>(SETTINGS.BLOG_COLLECTION_NAME, blogSchema);
