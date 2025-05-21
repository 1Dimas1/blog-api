import {InvalidRefreshTokenModelType, InvalidRefreshTokenType} from "./auth.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";
import {invalidRefreshTokenSchema} from "./invalid-refresh-token-schema";

export const InvalidRefreshTokenModel: InvalidRefreshTokenModelType = mongoose.model<InvalidRefreshTokenType, InvalidRefreshTokenModelType>(SETTINGS.INVALID_TOKENS_COLLECTION_NAME, invalidRefreshTokenSchema)