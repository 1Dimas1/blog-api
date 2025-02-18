import {RATE_LIMIT, RateLimitResult, RateLimitType} from "./rate-limit.type";
import {rateLimitRepository} from "./rate-limit-repository";

export const rateLimitService = {
    async checkRateLimit(ip: string, url: string): Promise<RateLimitResult> {
        const now = new Date();
        const windowStart = new Date(now.getTime() - RATE_LIMIT.WINDOW_MS);

        await rateLimitRepository.cleanup();

        const attempt: RateLimitType = {
            ip,
            url,
            date: now
        };
        await rateLimitRepository.createAttempt(attempt);

        const attemptsCount: number = await rateLimitRepository.countAttempts(ip, url, windowStart);

        if (attemptsCount > RATE_LIMIT.MAX_ATTEMPTS) {
            return {
                isLimited: true,
                retryAfter: RATE_LIMIT.RETRY_AFTER
            };
        }

        return {
            isLimited: false
        };
    }
}