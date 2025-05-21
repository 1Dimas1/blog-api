import mongoose from "mongoose";
import {BlogType} from "./blog.type";

export const blogSchema = new mongoose.Schema<BlogType>({
    name: {
        type: String,
        required: true,
        maxLength: 15,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 500,
        trim: true
    },
    websiteUrl: {
        type: String,
        required: true,
        maxLength: 100,
        trim: true,
        validate: {
            validator: function(v: string): boolean {
                return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid website URL!`
        }
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        immutable: true,
    },
    isMembership: {
        type: Boolean,
        default: false
    }
});