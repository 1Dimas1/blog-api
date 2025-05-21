import {DeleteResult} from "mongodb";
import {UserDocument, UserInputType, UserType, UserViewType} from "./user.type";
import UsersRepository from "./users-repository";
import {BcryptService} from "../auth/bcrypt-service";
import {v4 as uuidv4} from "uuid";
import {RegistrationInputDto} from "../auth/auth.type";
import {SETTINGS} from "../../settings";
import UsersQueryRepository from "./users-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export default class UsersService {
    constructor(
        @inject(UsersRepository)
        private usersRepository: UsersRepository,
        @inject(UsersQueryRepository)
        private usersQueryRepository: UsersQueryRepository,
        @inject(BcryptService)
        private bcryptService: BcryptService,
    ) {}

    async createUser(userData: UserInputType): Promise<UserViewType | null> {
        const newUser: UserType = await this.createUserEntity(userData)
        const result: UserDocument = await this.usersRepository.createUser(newUser);
        return this.usersQueryRepository.findUserById(result.id)
    }

    async deleteUser(id: string): Promise<boolean> {
        const result: DeleteResult = await this.usersRepository.deleteUser(id)
        return result.deletedCount === 1
    }

    async findDuplicateCredential(login: string, email: string): Promise<string | null> {
        const loginUser: UserDocument | null = await this.usersRepository.findByLoginOrEmail(login);
        if (loginUser) {
            return 'login';
        }

        const emailUser: UserDocument | null = await this.usersRepository.findByLoginOrEmail(email);
        if (emailUser) {
            return 'email';
        }

        return null;
    }

    async createUserEntity(
        input: UserInputType | RegistrationInputDto,
        isConfirmed: boolean = true
    ): Promise<UserType> {
        const hashedPassword: string = await this.bcryptService.hashPassword(input.password);
        const confirmationCode: string | null = !isConfirmed ? uuidv4() : null;

        return {
            login: input.login,
            email: input.email,
            password: hashedPassword,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode,
                expirationDate: !isConfirmed ? SETTINGS.EMAIL_CONFIRMATION_CODE_EXP_DATE_24_H : null,
                isConfirmed
            }
        };
    }
}