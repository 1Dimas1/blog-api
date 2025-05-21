import {UserModelType, UserType} from "./user.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";
import {userSchema} from "./user-schema";

export const UserModel: UserModelType = mongoose.model<UserType, UserModelType>(SETTINGS.USER_COLLECTION_NAME, userSchema)