import {DeleteResult, InsertOneResult} from "mongodb";
import {UserDBType, UserInputType, UserViewModel, UserType} from "./user.type";
import {usersRepository} from "./users-repository";
import {usersQueryRepository} from "./users-queryRepository";
import {bcryptService} from "../auth/bcrypt-service";

export const usersService = {
    async createUser(userData: UserInputType): Promise<UserViewModel | null> {
        //TODO
        // const loginUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.login);
        // const emailUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.email);
        //  if (loginUser || emailUser) {
        //  }

        const hashedPassword: string = await bcryptService.hashPassword(userData.password);

        const newUser: UserType = {
            login: userData.login,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }

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
    }
}