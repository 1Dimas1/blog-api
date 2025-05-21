import {RateLimitDocument, RateLimitType} from "./rate-limit.type";
import {RateLimitModel} from "./rate-limit-model";

export const rateLimitRepository = {
    async createAttempt(attempt: RateLimitType): Promise<RateLimitDocument> {
        return RateLimitModel.insertOne(attempt);
    },

    async countAttempts(ip: string, url: string, startDate: Date): Promise<number> {
        return RateLimitModel.countDocuments({
            ip,
            url,
            date: { $gte: startDate }
        });
    },

    async cleanup(): Promise<void> {
        const tenSecondsAgo = new Date(Date.now() - 10000);
        await RateLimitModel.deleteMany({
            date: { $lt: tenSecondsAgo }
        });
    }
}