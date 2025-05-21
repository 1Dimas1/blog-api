import mongoose, {HydratedDocument, Model} from "mongoose";

export type SecurityDeviceType = {
    ip: string;
    title: string;
    lastActiveDate: Date;
    deviceId: string;
    userId: mongoose.Types.ObjectId;
    expirationDate: Date;
}

export type SecurityDeviceViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}

export type SecurityDeviceDocument = HydratedDocument<SecurityDeviceType>

export type SecurityDeviceModelType = Model<SecurityDeviceType, {}, {}, {}, SecurityDeviceDocument>