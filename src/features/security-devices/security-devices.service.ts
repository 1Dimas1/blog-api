import {v4 as uuidv4} from "uuid";
import {SecurityDeviceType, SecurityDeviceViewModel} from "./security-device.type";
import {securityDevicesRepository} from "./security-devices.repository";
import {Result, ResultStatus} from "../../common/types/result.type";

export const securityDevicesService = {
    async createUserDevice(userId: string, ip: string, userAgent: string, expirationDate: string): Promise<string> {
        const deviceId: string = uuidv4();
        const device: SecurityDeviceType = {
            ip,
            title: userAgent || 'Unknown device',
            lastActiveDate: new Date().toISOString(),
            deviceId,
            userId,
            expirationDate
        };

        await securityDevicesRepository.createDevice(device);
        return deviceId;
    },

    async getAllUserDevices(userId: string): Promise<SecurityDeviceViewModel[]> {
        return securityDevicesRepository.getAllUserDevices(userId);
    },

    async findDevice(userId: string, deviceId: string): Promise<Result<SecurityDeviceType>> {
        const device: SecurityDeviceType | null = await securityDevicesRepository.findDeviceById(deviceId);

        if (!device) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: []
            };
        }

        if (device.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                extensions: []
            };
        }

        return {
            status: ResultStatus.Success,
            data: device,
            extensions: []
        };
    },

    async updateLastActiveDate(deviceId: string, lastActiveDate: string): Promise<void> {
        await securityDevicesRepository.updateLastActiveDate(deviceId, lastActiveDate);
    },

    async deleteDevice(userId: string, deviceId: string): Promise<Result> {
        const device: SecurityDeviceType | null = await securityDevicesRepository.findDeviceById(deviceId);

        if (!device) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                extensions: []
            };
        }

        if (device.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                extensions: []
            };
        }

        await securityDevicesRepository.deleteDevice(deviceId);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async deleteAllOtherUserDevices(userId: string, currentDeviceId: string): Promise<void> {
        await securityDevicesRepository.deleteAllUserDevicesExceptCurrent(userId, currentDeviceId);
    },

    async terminateSession(deviceId: string): Promise<void> {
        await securityDevicesRepository.deleteDevice(deviceId);
    }
}