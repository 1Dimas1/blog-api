import {HydratedDocument, Model} from "mongoose";

export type RateLimitType = {
    ip: string;
    url: string;
    date: Date;
}

export type RateLimitResult = {
    isLimited: boolean;
    retryAfter?: number;
}

export const RATE_LIMIT = {
    WINDOW_MS: 10000,
    MAX_ATTEMPTS: 5,
    RETRY_AFTER: 10
}

export type RateLimitDocument = HydratedDocument<RateLimitType>

export type RateLimitModelType = Model<RateLimitType, {}, {}, {}, RateLimitDocument>