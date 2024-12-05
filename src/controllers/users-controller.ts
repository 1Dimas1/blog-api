import {RequestWithBody, RequestWithQuery} from "../types/request.type";
import {Response} from "express";
import {QueryUserType, UserInputType, UserOutPutType, UsersPaginator} from "../types/user.type";
import {HTTP_CODES} from "../settings";
import {paginationUserQueries} from "../helpers/pagination-values";
import {usersService} from "../services/users-service";

export const usersController = {
    async getUsers(req: RequestWithQuery<QueryUserType>, res: Response<UsersPaginator>){
        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = paginationUserQueries(req)
        const users: UsersPaginator = await usersService.getUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        res.status(HTTP_CODES.OK_200).json(users)
    },
    async createUser(req: RequestWithBody<UserInputType>, res: Response<UserOutPutType | ErrorResponse>){
        const nonUniqueField = await usersService.getNonUniqueField(req.body.login, req.body.email)
        if (nonUniqueField) {
            res.status(HTTP_CODES.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        field: nonUniqueField,
                        message: `${nonUniqueField} should be unique`,
                    },
                ],
            });
            return;
        }

        const newUser: UserOutPutType = await usersService.createUser(req.body)
        res.status(HTTP_CODES.CREATED_201).json(newUser)
    },
    async deleteUser() {
        return
    }
}