import {SecurityDeviceDocument, SecurityDeviceType, SecurityDeviceViewModel} from "./security-device.type";
import {DeleteResult, UpdateResult} from "mongodb";
import {injectable} from "inversify";
import {SecurityDeviceModel} from "./security-device-model";

@injectable()
export default class SecurityDevicesRepository {
    async createDevice(device: SecurityDeviceType): Promise<SecurityDeviceDocument> {
        return SecurityDeviceModel.insertOne(device);
    }

    async findDeviceById(deviceId: string): Promise<SecurityDeviceDocument | null> {
        return SecurityDeviceModel.findById(deviceId).exec();
    }

    async getAllUserDevices(userId: string): Promise<SecurityDeviceViewModel[]> {
        const devices: SecurityDeviceDocument[] = await SecurityDeviceModel.find({userId}).exec();
        return devices.map(this._mapDeviceToOutput)
    }

    async updateLastActiveDate(deviceId: string, lastActiveDate: string): Promise<UpdateResult<SecurityDeviceDocument>> {
        return SecurityDeviceModel.updateOne(
            {deviceId},
            {$set: {lastActiveDate}}
        );
    }

    async deleteDevice(deviceId: string): Promise<DeleteResult> {
        return SecurityDeviceModel.deleteOne({deviceId});
    }

    async deleteAllUserDevicesExceptCurrent(userId: string, deviceId: string): Promise<DeleteResult> {
        return SecurityDeviceModel.deleteMany({
            userId,
            deviceId: {$ne: deviceId}
        });
    }

    _mapDeviceToOutput(device: SecurityDeviceDocument): SecurityDeviceViewModel {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate.toISOString(),
            deviceId: device.deviceId
        };
    }
}