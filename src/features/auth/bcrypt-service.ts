import bcrypt from 'bcrypt';

export const bcryptService = {
    async checkPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
};