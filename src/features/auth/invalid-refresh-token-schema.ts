import mongoose from "mongoose";
import {InvalidRefreshTokenType} from "./auth.type";

export const invalidRefreshTokenSchema = new mongoose.Schema<InvalidRefreshTokenType>({
    token: String,
    expiredAt: Date,
})