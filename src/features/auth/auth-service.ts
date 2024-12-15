import {UserDBType} from "../users/user.type";
import {usersRepository} from "../users/users-repository";
import {compare} from "bcrypt";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<boolean> {
        return  await this.checkCredentials(loginOrEmail, password);
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user: UserDBType | null = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return false;
        }

        const isPasswordValid: boolean = await this.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return false;
        }

        return true;
    },
    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    },
}