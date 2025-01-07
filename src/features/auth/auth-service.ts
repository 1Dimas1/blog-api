import {LoginSuccessDto, UserInfoDto} from "./auth.type";
import {Result, ResultStatus} from "../../common/types/result.type";
import {jwtService} from "./jwt-service";
import {WithId} from "mongodb";
import {UserDBType} from "../users/user.type";
import {usersRepository} from "../users/users-repository";
import {bcryptService} from "./bcrypt-service";

export const authService = {
    async loginUser(loginOrEmail: string,password: string): Promise<Result<LoginSuccessDto | null>> {
        const result: Result<WithId<UserDBType> | null> = await this.checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{ field: "loginOrEmail", message: "Wrong credentials" }],
                data: null,
            };
        }

        const accessToken = jwtService.createAccessToken(
            result.data!._id.toString()
        );

        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
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