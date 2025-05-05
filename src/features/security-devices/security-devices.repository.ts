import {securityDevicesCollection} from "../../db/db";
import {SecurityDeviceType, SecurityDeviceViewModel} from "./security-device.type";
import {DeleteResult, InsertOneResult, UpdateResult, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export default class SecurityDevicesRepository {
    async createDevice(device: SecurityDeviceType): Promise<InsertOneResult<SecurityDeviceType>> {
        return securityDevicesCollection.insertOne(device);
    }

    async findDeviceById(deviceId: string): Promise<SecurityDeviceType | null> {
        return securityDevicesCollection.findOne({deviceId});
    }

    async getAllUserDevices(userId: string): Promise<SecurityDeviceViewModel[]> {
        const devices: WithId<SecurityDeviceType>[] = await securityDevicesCollection.find({userId}).toArray();
        return devices.map(this._mapDeviceToOutput)
    }

    async updateLastActiveDate(deviceId: string, lastActiveDate: string): Promise<UpdateResult<SecurityDeviceType>> {
        return securityDevicesCollection.updateOne(
            {deviceId},
            {$set: {lastActiveDate}}
        );
    }

    async deleteDevice(deviceId: string): Promise<DeleteResult> {
        return securityDevicesCollection.deleteOne({deviceId});
    }

    async deleteAllUserDevicesExceptCurrent(userId: string, deviceId: string): Promise<DeleteResult> {
        return securityDevicesCollection.deleteMany({
            userId,
            deviceId: {$ne: deviceId}
        });
    }

    async deleteExpiredSessions(): Promise<DeleteResult> {
        return securityDevicesCollection.deleteMany({
            expirationDate: {$lt: new Date().toISOString()}
        });
    }

    async deleteUserDevices(userId: string): Promise<DeleteResult> {
        return securityDevicesCollection.deleteMany({userId});
    }

    _mapDeviceToOutput(device: SecurityDeviceType): SecurityDeviceViewModel {
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        };
    }
}