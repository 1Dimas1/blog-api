import { NextFunction, Request, Response } from "express";
import {rateLimitService} from "./rate-limit.service";
import {HTTP_CODES} from "../http.statuses";
import {RateLimitResult} from "./rate-limit.type";

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const ip: string = req.ip || req.socket.remoteAddress || 'unknown';
        const url: string = req.baseUrl || req.originalUrl;

        const result: RateLimitResult = await rateLimitService.checkRateLimit(ip, url);

        if (result.isLimited) {
            res.set('Retry-After', result.retryAfter?.toString() || '10');
            res.status(HTTP_CODES.TOO_MANY_REQUESTS_429).json({
                message: 'Too many requests, please try again later'
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Rate limit middleware error:', error);
        next();
    }
}