import {Request} from "express";

export type RequestWithBody<T> = Request<{}, {}, T>

export type RequestWithQuery<T> = Request<{}, {}, {}, T>

export type RequestWithParamsAndQuery<T, Q> = Request<T, {}, {}, Q>

export type RequestWithParams<T> = Request<T>

export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type RequestWithRefreshToken = Request & {
    cookies: {
        refreshToken?: string;
    };
};

export type RequestWithAccessToken = Request & {
    headers: {
        authorization?: string;
    };
};
