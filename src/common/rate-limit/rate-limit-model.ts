import mongoose from "mongoose";
import {RateLimitModelType, RateLimitType} from "./rate-limit.type";
import {SETTINGS} from "../../settings";
import {rateLimitSchema} from "./rate-limit-schema";

export const RateLimitModel: RateLimitModelType = mongoose.model<RateLimitType, RateLimitModelType>(SETTINGS.RATE_LIMIT_COLLECTION, rateLimitSchema);