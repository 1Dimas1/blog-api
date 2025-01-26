import {LoginSuccessDto, RegistrationInputDto, UserInfoDto} from "./auth.type";
import {Result, ResultStatus} from "../../common/types/result.type";
import {jwtService, TokenPayload} from "./jwt-service";
import {WithId} from "mongodb";
import {UserDBType, UserType} from "../users/user.type";
import {usersRepository} from "../users/users-repository";
import {bcryptService} from "./bcrypt-service";
import {emailComposition} from "../../composition-root/email.composition";
import {usersService} from "../users/users-service";
import {v4 as uuidv4} from "uuid";
import {invalidRefreshTokenService} from "./invalid.refresh.tokens-service";

export const authService = {

    emailManager: emailComposition.getEmailManager(),

    async loginUser(loginOrEmail: string, password: string): Promise<Result<LoginSuccessDto | null>> {
        const result: Result<WithId<UserDBType> | null> = await this.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
                data: null,
            };
        }

        const accessToken = jwtService.createAccessToken(result.data!._id.toString());
        const refreshToken = jwtService.createRefreshToken(result.data!._id.toString());

        return {
            status: ResultStatus.Success,
            data: { accessToken,  refreshToken },
            extensions: [],
        };
    },

    async refreshTokens(refreshToken: string): Promise<Result<LoginSuccessDto>> {
        const verifyResult: Result<TokenPayload> = await jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await invalidRefreshTokenService.addToBlacklist(refreshToken);

        const userId: string = verifyResult.data!.userId;
        const newAccessToken: string = jwtService.createAccessToken(userId);
        const newRefreshToken: string = jwtService.createRefreshToken(userId);

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
        const verifyResult: Result<TokenPayload> = await jwtService.verifyRefreshToken(refreshToken);

        if (verifyResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                extensions: verifyResult.extensions
            };
        }

        await invalidRefreshTokenService.addToBlacklist(refreshToken);
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

        await this.emailManager.sendConfirmationEmail(newUser.email, newUser.emailConfirmation.confirmationCode!);

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
        await this.emailManager.sendConfirmationEmail(email, newConfirmationCode);

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