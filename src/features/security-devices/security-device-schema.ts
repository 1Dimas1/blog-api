import mongoose from "mongoose";
import {SecurityDeviceType} from "./security-device.type";
import {SETTINGS} from "../../settings";

export const securityDeviceSchema = new mongoose.Schema<SecurityDeviceType>({
    ip: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    lastActiveDate: {
        type: Date,
        required: true,
    },
    deviceId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SETTINGS.USER_COLLECTION_NAME,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
})