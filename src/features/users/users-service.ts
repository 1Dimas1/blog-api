import {DeleteResult, InsertOneResult} from "mongodb";
import {UserDBType, UserInputType, UserType, UserViewModel} from "./user.type";
import {usersRepository} from "./users-repository";
import {bcryptService} from "../auth/bcrypt-service";
import {v4 as uuidv4} from "uuid";
import {RegistrationInputDto} from "../auth/auth.type";
import {SETTINGS} from "../../settings";
import {usersQueryRepository} from "./users-queryRepository";

export const usersService = {
    async createUser(userData: UserInputType): Promise<UserViewModel | null> {
        //TODO
        // const loginUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.login);
        // const emailUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.email);
        //  if (loginUser || emailUser) {
        //  }


        const newUser: UserType = await this.createUserEntity(userData)

        const result: InsertOneResult<UserDBType> = await usersRepository.createUser(newUser);
        return usersQueryRepository.findUserById(result.insertedId.toString())
    },
    async deleteUser(id: string): Promise<boolean> {
        const result: DeleteResult = await usersRepository.deleteUser(id)
        return result.deletedCount === 1
    },
    async findDuplicateCredential(login: string, email: string): Promise<string | null> {
        const loginUser: UserDBType | null = await usersRepository.findByLoginOrEmail(login);
        if (loginUser) {
            return 'login';
        }

        const emailUser: UserDBType | null = await usersRepository.findByLoginOrEmail(email);
        if (emailUser) {
            return 'email';
        }

        return null;
    },
    async createUserEntity(
        input: UserInputType | RegistrationInputDto,
        isConfirmed: boolean = true
    ): Promise<UserType> {
        const hashedPassword = await bcryptService.hashPassword(input.password);
        const confirmationCode = !isConfirmed ? uuidv4() : null;

        return {
            login: input.login,
            email: input.email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode,
                expirationDate: !isConfirmed ? SETTINGS.EMAIL_CONFIRMATION_CODE_EXP_DATE_24_H : null,
                isConfirmed
            }
        };
    }
}