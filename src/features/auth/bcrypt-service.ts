import bcrypt, {hash} from 'bcrypt';
import {injectable} from "inversify";

@injectable()
export class BcryptService {
    async checkPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await hash(password, saltRounds);
    }
}