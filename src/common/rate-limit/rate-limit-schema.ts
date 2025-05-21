import {RateLimitType} from "./rate-limit.type";
import mongoose from "mongoose";

export const rateLimitSchema = new mongoose.Schema<RateLimitType>({
    ip: String,
    url: String,
    date: Date,
})