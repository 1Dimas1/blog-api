import {Response} from "express";
import {HTTP_CODES} from "../../common/http.statuses";
import SecurityDevicesService from "./security-devices.service";
import {SecurityDeviceViewModel} from "./security-device.type";
import {JwtService, RefreshTokenPayload} from "../auth/jwt-service";
import {Result, ResultStatus} from "../../common/types/result.type";
import {resultCodeToHttpException} from "../../common/helpers/result-code.mapper";
import {RequestWithRefreshToken} from "../../common/types/request.type";
import {inject, injectable} from "inversify";

@injectable()
export default class SecurityDevicesController {
    constructor(
        @inject(SecurityDevicesService)
        private securityDevicesService: SecurityDevicesService,
        @inject(JwtService)
        private jwtService: JwtService,
    ) {}

    async getAllDevices(req: RequestWithRefreshToken, res: Response) {
        try {
            if (!req.cookies.refreshToken) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            const verifyResult: Result<RefreshTokenPayload> = await this.jwtService.verifyRefreshToken(req.cookies.refreshToken);
            if (verifyResult.status !== ResultStatus.Success) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            const devices: SecurityDeviceViewModel[] = await this.securityDevicesService.getAllUserDevices(verifyResult.data!.userId);
            res.status(HTTP_CODES.OK_200).json(devices);
        } catch (error) {
            res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
        }
    }

    async deleteAllOtherSessions(req: RequestWithRefreshToken, res: Response) {
        try {
            if (!req.cookies.refreshToken) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            const verifyResult: Result<RefreshTokenPayload> = await this.jwtService.verifyRefreshToken(req.cookies.refreshToken);
            if (verifyResult.status !== ResultStatus.Success) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            await this.securityDevicesService.deleteAllOtherUserDevices(
                verifyResult.data!.userId,
                verifyResult.data!.deviceId
            );
            res.sendStatus(HTTP_CODES.NO_CONTENT_204);
        } catch (error) {
            res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
        }
    }

    async deleteDeviceSession(req: RequestWithRefreshToken, res: Response) {
        try {
            if (!req.cookies.refreshToken) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            const verifyResult: Result<RefreshTokenPayload> = await this.jwtService.verifyRefreshToken(req.cookies.refreshToken);
            if (verifyResult.status !== ResultStatus.Success) {
                res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
                return;
            }

            const result: Result = await this.securityDevicesService.deleteDevice(
                verifyResult.data!.userId,
                req.params.deviceId
            );

            if (result.status !== ResultStatus.Success) {
                res.sendStatus(resultCodeToHttpException(result.status))
            }

            res.sendStatus(HTTP_CODES.NO_CONTENT_204)
        } catch (error) {
            res.sendStatus(HTTP_CODES.UNAUTHORIZED_401);
        }
    }
}