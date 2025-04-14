import {LoginSuccessDto, LoginUserDto, RegistrationInputDto, UserInfoDto} from "./auth.type";
import {Result, ResultStatus} from "../../common/types/result.type";
import {jwtService, RefreshTokenPayload} from "./jwt-service";
import {WithId} from "mongodb";
import {UserDBType, UserType} from "../users/user.type";
import {usersRepository} from "../users/users-repository";
import {bcryptService} from "./bcrypt-service";
import {emailComposition} from "../../composition-root/email.composition";
import {usersService} from "../users/users-service";
import {v4 as uuidv4} from "uuid";
import {invalidRefreshTokenService} from "./invalid.refresh.tokens-service";
import {securityDevicesService} from "../security-devices/security-devices.service";
import {SecurityDeviceType} from "../security-devices/security-device.type";

export const authService = {

    emailManager: emailComposition.getEmailManager(),
    emailTemplateManager: emailComposition.getEmailTemplateManager(),

    async loginUser(command: LoginUserDto): Promise<Result<LoginSuccessDto | null>> {
        const result: Result<WithId<UserDBType> | null> = await this.checkUserCredentials(
            command.loginOrEmail,
            command.password
        );

        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
                data: null,
            };
        }

        const deviceId: string = await securityDevicesService.createUserDevice(
            result.data!._id.toString(),
            command.ip || 'unknown',
            command.userAgent || 'Unknown',
            new Date(Date.now() + parseInt(process.env.JWT_REFRESH_TIME!)).toISOString()
        );

        const accessToken: string = jwtService.createAccessToken(result.data!._id.toString());
        const refreshToken: string = jwtService.createRefreshToken(result.data!._id.toString(), deviceId);

        return {
            status: ResultStatus.Success,
            data: { accessToken,  refreshToken },
            extensions: [],
        };
    },

    async refreshTokens(refreshToken: string): Promise<Result<LoginSuccessDto>> {
        const verifyResult: Result<RefreshTokenPayload> = await jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await invalidRefreshTokenService.addToBlacklist(refreshToken);

        const userId: string = verifyResult.data!.userId;
        const deviceId: string = verifyResult.data!.deviceId;

        const deviceExistResult: Result<SecurityDeviceType> = await securityDevicesService.findDevice(userId, deviceId)

        if (deviceExistResult.status !== ResultStatus.Success) {
            return {
                status: deviceExistResult.status,
                data: null,
                extensions: deviceExistResult.extensions
            };
        }

        await securityDevicesService.updateLastActiveDate(deviceId, new Date().toISOString());

        const newAccessToken: string = jwtService.createAccessToken(userId);
        const newRefreshToken: string = jwtService.createRefreshToken(userId, deviceId);

        return {
            status: ResultStatus.Success,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            extensions: []
        };
    },

    async logout(refreshToken: string): Promise<Result> {
        const verifyResult: Result<RefreshTokenPayload> = await jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await invalidRefreshTokenService.addToBlacklist(refreshToken);

        const userId: string = verifyResult.data!.userId;
        const deviceId: string = verifyResult.data!.deviceId;

        const deviceExistResult: Result<SecurityDeviceType> = await securityDevicesService.findDevice(userId, deviceId)

        if (deviceExistResult.status !== ResultStatus.Success) {
            return {
                status: deviceExistResult.status,
                data: null,
                extensions: deviceExistResult.extensions
            };
        }

        await securityDevicesService.terminateSession(verifyResult.data!.deviceId);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async registerUser(input: RegistrationInputDto): Promise<Result> {
        const existingUser: UserDBType | null = await usersRepository.findByLoginOrEmail(input.login)
            || await usersRepository.findByLoginOrEmail(input.email);

        if (existingUser) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "User already exists",
                    field: existingUser.email === input.email ? "email" : "login"
                }]
            };
        }

        const newUser: UserType = await usersService.createUserEntity(input, false);
        await usersRepository.createUser(newUser)

        const { subject, html } = this.emailTemplateManager.getConfirmationEmailTemplate(
            newUser.emailConfirmation.confirmationCode!
        );
        this.emailManager.sendEmail(newUser.email, subject, html).catch();

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async confirmRegistration(code: string): Promise<Result> {
        const user: UserDBType | null = await usersRepository.findByConfirmationCode(code);

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Invalid confirmation code",
                    field: "code"
                }]
            };
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Email already confirmed",
                    field: "code"
                }]
            };
        }

        if (user.emailConfirmation.expirationDate! < new Date().toISOString()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Confirmation code expired",
                    field: "code"
                }]
            };
        }

        await usersRepository.confirmEmail(user._id.toString());

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async resendConfirmationEmail(email: string): Promise<Result> {
        const user: UserDBType | null = await usersRepository.findByLoginOrEmail(email);

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "User not found",
                    field: "email"
                }]
            };
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Email already confirmed",
                    field: "email"
                }]
            };
        }

        const newConfirmationCode: string = uuidv4();
        await usersRepository.updateConfirmationCode(user._id.toString(), newConfirmationCode);

        const { subject, html } = this.emailTemplateManager.getConfirmationEmailTemplate(newConfirmationCode);
        this.emailManager.sendEmail(email, subject, html).catch();

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async initiatePasswordRecovery(email: string): Promise<Result> {
        const user: UserDBType | null = await usersRepository.findByLoginOrEmail(email);

        if (user) {
            const recoveryCode: string = uuidv4();

            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);

            await usersRepository.setPasswordRecoveryCode(
                user._id.toString(),
                recoveryCode,
                expirationDate.toISOString()
            );

            const { subject, html } = this.emailTemplateManager.getPasswordRecoveryEmailTemplate(recoveryCode);
            this.emailManager.sendEmail(email, subject, html).catch();
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async setNewPassword(recoveryCode: string, newPassword: string): Promise<Result> {
        const user: UserDBType | null = await usersRepository.findByPasswordRecoveryCode(recoveryCode);

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Recovery code is incorrect or expired",
                    field: "recoveryCode"
                }]
            };
        }

        if (user.passwordRecovery &&
            user.passwordRecovery.expirationDate &&
            new Date(user.passwordRecovery.expirationDate) < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                extensions: [{
                    message: "Recovery code is expired",
                    field: "recoveryCode"
                }]
            };
        }

        const passwordHash: string = await bcryptService.hashPassword(newPassword);

        await usersRepository.updatePassword(user._id.toString(), passwordHash);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<Result<WithId<UserDBType> | null>> {
        const user: UserDBType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Not Found",
                extensions: [{ field: "loginOrEmail", message: "Not Found" }],
            };
        }

        const isPassCorrect = await bcryptService.checkPassword(
            password,
            user.password
        );

        if (!isPassCorrect) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: "Bad Request",
                extensions: [{ field: "password", message: "Wrong password" }],
            };
        }

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: []
        };
    },

    async getCurrentUser(userId: string): Promise<Result<UserInfoDto>> {
        const user: UserDBType | null = await usersRepository.findUserById(userId);

        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: [{
                    message: "User not found",
                    field: "authorization"
                }]
            };
        }

        return {
            status: ResultStatus.Success,
            data: {
                email: user.email,
                login: user.login,
                userId: user._id.toString()
            },
            extensions: []
        };
    },
};