import {SecurityDeviceModelType, SecurityDeviceType} from "./security-device.type";
import mongoose from "mongoose";
import {SETTINGS} from "../../settings";
import {securityDeviceSchema} from "./security-device-schema";

export const SecurityDeviceModel: SecurityDeviceModelType = mongoose.model<SecurityDeviceType, SecurityDeviceModelType>(SETTINGS.SECURITY_DEVICES_COLLECTION, securityDeviceSchema)