import {DeleteResult, UpdateResult} from "mongodb";
import {UserDocument, UserType} from "./user.type";
import {SETTINGS} from "../../settings";
import {injectable} from "inversify";
import {UserModel} from "./user-model";

@injectable()
export default class UsersRepository {
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        return UserModel.findOne({
            $or: [
                { email: loginOrEmail },
                { login: loginOrEmail }
            ]
        }).exec();
    }

    async doesExistById(id: string): Promise<boolean> {
        const user: Promise<UserDocument | null> = this.findUserById(id)
        return user != null;
    }

    async findUserById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).exec();
    }

    async findByConfirmationCode(code: string): Promise<UserDocument | null> {
        return UserModel.findOne({
            'emailConfirmation.confirmationCode': code
        }).exec();
    }

    async confirmEmail(id: string): Promise<UpdateResult<UserDocument>> {
        return UserModel.updateOne(
            { _id: id },
            {
                $set: {
                    'emailConfirmation.isConfirmed': true,
                    'emailConfirmation.confirmationCode': null,
                    'emailConfirmation.expirationDate': null
                }
            }
        )
    }

    async updateConfirmationCode(id: string, newConfirmationCode: string): Promise<UpdateResult<UserDocument>> {
        return UserModel.updateOne(
            { _id: id },
            {
                $set: {
                    'emailConfirmation.confirmationCode': newConfirmationCode,
                    'emailConfirmation.expirationDate': SETTINGS.EMAIL_CONFIRMATION_CODE_EXP_DATE_24_H
                }
            }
        );
    }

    async createUser(user: UserType): Promise<UserDocument> {
        return UserModel.insertOne(user)
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return UserModel.deleteOne({_id: id})
    }

    async setPasswordRecoveryCode(
        userId: string,
        recoveryCode: string,
        expirationDate: string
    ): Promise<UpdateResult<UserDocument>> {
        return UserModel.updateOne(
            { _id: userId },
            {
                $set: {
                    'passwordRecovery.recoveryCode': recoveryCode,
                    'passwordRecovery.expirationDate': expirationDate
                }
            }
        );
    }

    async findByPasswordRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
        return UserModel.findOne({
            'passwordRecovery.recoveryCode': recoveryCode
        }).exec();
    }

    async updatePassword(userId: string, passwordHash: string): Promise<UpdateResult<UserDocument>> {
        return UserModel.updateOne(
            { _id: userId },
            {
                $set: {
                    password: passwordHash
                },
                $unset: {
                    'passwordRecovery': 1
                }
            }
        );
    }
}