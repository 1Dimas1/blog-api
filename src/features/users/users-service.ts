import {DeleteResult, InsertOneResult} from "mongodb";
import {UserDBType, UserInputType, UserOutPutType, UserType} from "./user.type";
import {usersRepository} from "./users-repository";
import {hash} from 'bcrypt'
import {usersQueryRepository} from "./users-queryRepository";

export const usersService = {
    async createUser(userData: UserInputType): Promise<UserOutPutType | null> {
        // const loginUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.login);
        // const emailUser: UserDBType | null = await usersRepository.findByLoginOrEmail(userData.email);
        //  if (loginUser || emailUser) {
        //
        //  }

        const hashedPassword: string = await this.hashPassword(userData.password);

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

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await hash(password, saltRounds);
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