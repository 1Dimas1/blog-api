import {SortDirection} from "mongodb";
import {UserDocument, UserViewType} from "./user.type";
import {injectable} from "inversify";
import {UserModel} from "./user-model";

@injectable()
export default class UsersQueryRepository {
    async getUsers(
        sortBy: string,
        sortDirection: SortDirection,
        pageNumber: number,
        pageSize: number,
        query: any
    ): Promise<UserViewType[]> {
        const users: UserDocument[] = await UserModel
            .find(query)
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();
        return users.map(this._mapToOutput)
    }

    async getUsersCount(query: any): Promise<number> {
        return UserModel.countDocuments(query)
    }

    async findUserById(id: string): Promise<UserViewType | null> {
        const user: UserDocument | null = await UserModel.findById(id);
        return user ? this._mapToOutput(user) : null;
    }

    _mapToOutput(user: UserDocument): UserViewType {
        return {
            id: user.id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}