import {RateLimitType} from "./rate-limit.type";
import {InsertOneResult} from "mongodb";
import {rateLimitCollection} from "../../db/db";

export const rateLimitRepository = {
    async createAttempt(attempt: RateLimitType): Promise<InsertOneResult<RateLimitType>> {
        return rateLimitCollection.insertOne(attempt);
    },

    async countAttempts(ip: string, url: string, startDate: Date): Promise<number> {
        return rateLimitCollection.countDocuments({
            ip,
            url,
            date: { $gte: startDate }
        });
    },

    async cleanup(): Promise<void> {
        const tenSecondsAgo = new Date(Date.now() - 10000);
        await rateLimitCollection.deleteMany({
            date: { $lt: tenSecondsAgo }
        });
    }
}