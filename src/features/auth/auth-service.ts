import {LoginSuccessDto, LoginUserDto, RegistrationInputDto, UserInfoDto} from "./auth.type";
import {Result, ResultStatus} from "../../common/types/result.type";
import {JwtService, RefreshTokenPayload} from "./jwt-service";
import {UserDocument, UserType} from "../users/user.type";
import UsersRepository from "../users/users-repository";
import {BcryptService} from "./bcrypt-service";
import UsersService from "../users/users-service";
import {v4 as uuidv4} from "uuid";
import InvalidRefreshTokenService from "./invalid.refresh.tokens-service";
import SecurityDevicesService from "../security-devices/security-devices.service";
import {SecurityDeviceType} from "../security-devices/security-device.type";
import {inject, injectable} from "inversify";
import {EmailManager} from "../../common/managers/email.manager";
import {EmailTemplateManager} from "../../common/managers/email-template.manager";
import {TYPES} from "../../common/types/identifiers";

@injectable()
export default class AuthService {
    constructor(
        @inject(TYPES.IEmailManager)
        private emailManager: EmailManager,
        @inject(TYPES.IEmailTemplateManager)
        private emailTemplateManager: EmailTemplateManager,
        @inject(SecurityDevicesService)
        private securityDevicesService: SecurityDevicesService,
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(UsersService)
        private usersService: UsersService,
        @inject(JwtService)
        private jwtService: JwtService,
        @inject(BcryptService)
        private bcryptService: BcryptService,
        @inject(InvalidRefreshTokenService)
        private invalidRefreshTokenService: InvalidRefreshTokenService

    ) {}


    async loginUser(dto: LoginUserDto): Promise<Result<LoginSuccessDto | null>> {
        const result: Result<UserDocument | null> = await this.checkUserCredentials(
            dto.loginOrEmail,
            dto.password
        );

        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
                data: null,
            };
        }

        const deviceId: string = await this.securityDevicesService.createUserDevice(
            result.data!._id,
            dto.ip || 'unknown',
            dto.userAgent || 'Unknown',
            new Date(Date.now() + parseInt(process.env.JWT_REFRESH_TIME!))
        );

        const accessToken: string = this.jwtService.createAccessToken(result.data!.id);
        const refreshToken: string = this.jwtService.createRefreshToken(result.data!.id, deviceId);

        return {
            status: ResultStatus.Success,
            data: { accessToken,  refreshToken },
            extensions: [],
        };
    }

    async refreshTokens(refreshToken: string): Promise<Result<LoginSuccessDto>> {
        const verifyResult: Result<RefreshTokenPayload> = await this.jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await this.invalidRefreshTokenService.addToBlacklist(refreshToken);

        const userId: string = verifyResult.data!.userId;
        const deviceId: string = verifyResult.data!.deviceId;

        const deviceExistResult: Result<SecurityDeviceType> = await this.securityDevicesService.findDevice(userId, deviceId)

        if (deviceExistResult.status !== ResultStatus.Success) {
            return {
                status: deviceExistResult.status,
                data: null,
                extensions: deviceExistResult.extensions
            };
        }

        await this.securityDevicesService.updateLastActiveDate(deviceId, new Date().toISOString());

        const newAccessToken: string = this.jwtService.createAccessToken(userId);
        const newRefreshToken: string = this.jwtService.createRefreshToken(userId, deviceId);

        return {
            status: ResultStatus.Success,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            extensions: []
        };
    }

    async logout(refreshToken: string): Promise<Result> {
        const verifyResult: Result<RefreshTokenPayload> = await this.jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await this.invalidRefreshTokenService.addToBlacklist(refreshToken);

        const userId: string = verifyResult.data!.userId;
        const deviceId: string = verifyResult.data!.deviceId;

        const deviceExistResult: Result<SecurityDeviceType> = await this.securityDevicesService.findDevice(userId, deviceId)

        if (deviceExistResult.status !== ResultStatus.Success) {
            return {
                status: deviceExistResult.status,
                data: null,
                extensions: deviceExistResult.extensions
            };
        }

        await this.securityDevicesService.terminateSession(verifyResult.data!.deviceId);
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async registerUser(input: RegistrationInputDto): Promise<Result> {
        const existingUser: UserDocument | null = await this.usersRepository.findByLoginOrEmail(input.login)
            || await this.usersRepository.findByLoginOrEmail(input.email);

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

        const newUser: UserType = await this.usersService.createUserEntity(input, false);
        await this.usersRepository.createUser(newUser)

        const { subject, html } = this.emailTemplateManager.getConfirmationEmailTemplate(
            newUser.emailConfirmation.confirmationCode!
        );
        this.emailManager.sendEmail(newUser.email, subject, html).catch();

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async confirmRegistration(code: string): Promise<Result> {
        const user: UserDocument | null = await this.usersRepository.findByConfirmationCode(code);

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

        await this.usersRepository.confirmEmail(user._id.toString());

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async resendConfirmationEmail(email: string): Promise<Result> {
        const user: UserDocument | null = await this.usersRepository.findByLoginOrEmail(email);

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
        await this.usersRepository.updateConfirmationCode(user._id.toString(), newConfirmationCode);

        const { subject, html } = this.emailTemplateManager.getConfirmationEmailTemplate(newConfirmationCode);
        this.emailManager.sendEmail(email, subject, html).catch();

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async initiatePasswordRecovery(email: string): Promise<Result> {
        const user: UserDocument | null = await this.usersRepository.findByLoginOrEmail(email);

        if (user) {
            const recoveryCode: string = uuidv4();

            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);

            await this.usersRepository.setPasswordRecoveryCode(
                user._id.toString(),
                recoveryCode,
                expirationDate.toISOString()
            );

            const { subject, html } = this.emailTemplateManager.getPasswordRecoveryEmailTemplate(recoveryCode);
            await this.emailManager.sendEmail(email, subject, html);
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async setNewPassword(recoveryCode: string, newPassword: string): Promise<Result> {
        const user: UserDocument | null = await this.usersRepository.findByPasswordRecoveryCode(recoveryCode);

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

        const passwordHash: string = await this.bcryptService.hashPassword(newPassword);

        await this.usersRepository.updatePassword(user._id.toString(), passwordHash);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: []
        };
    }

    async checkUserCredentials(
        loginOrEmail: string,
        password: string
    ): Promise<Result<UserDocument | null>> {
        const user: UserDocument | null = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Not Found",
                extensions: [{ field: "loginOrEmail", message: "Not Found" }],
            };
        }

        const isPassCorrect = await this.bcryptService.checkPassword(
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
    }

    async getCurrentUser(userId: string): Promise<Result<UserInfoDto>> {
        const user: UserDocument | null = await this.usersRepository.findUserById(userId);

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
    }
}