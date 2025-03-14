import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {UserDBType, UserType} from "./user.type";
import {userCollection} from "../../db/db";
import {SETTINGS} from "../../settings";

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        return userCollection.findOne({
            $or: [
                { email: loginOrEmail },
                { login: loginOrEmail }
            ]
        });
    },

    async doesExistById(id: string): Promise<boolean> {
        const user: Promise<UserDBType | null> = this.findUserById(id)
        if (!user) {
            return false;
        }

        return true;
    },

    async findUserById(id: string): Promise<UserDBType | null> {
        return userCollection.findOne({_id: new ObjectId(id)});
    },

    async findByConfirmationCode(code: string): Promise<UserDBType | null> {
        return userCollection.findOne({
            'emailConfirmation.confirmationCode': code
        });
    },

    async confirmEmail(id: string): Promise<UpdateResult<UserDBType>> {
        return userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    'emailConfirmation.isConfirmed': true,
                    'emailConfirmation.confirmationCode': null,
                    'emailConfirmation.expirationDate': null
                }
            }
        )
    },

    async updateConfirmationCode(id: string, newConfirmationCode: string): Promise<UpdateResult<UserDBType>> {
        return userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    'emailConfirmation.confirmationCode': newConfirmationCode,
                    'emailConfirmation.expirationDate': SETTINGS.EMAIL_CONFIRMATION_CODE_EXP_DATE_24_H
                }
            }
        );
    },

    async createUser(user: UserType): Promise<InsertOneResult<UserDBType>> {
        return userCollection.insertOne(user)
    },

    async deleteUser(id: string): Promise<DeleteResult> {
        return userCollection.deleteOne({_id: new ObjectId(id)})
    }
}