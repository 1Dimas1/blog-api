import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../common/types/request.type";
import {Response} from "express";
import {QueryUserType, URIParamsUserIdType, UserInputType, UserOutPutType, UsersPaginator} from "./user.type";
import {paginationUserQueries} from "../../common/helpers/pagination-values";
import {usersService} from "./users-service";
import {usersQueryService} from "./users-queryService";
import {HTTP_CODES} from "../../common/http.statuses";

export const usersController = {
    async getUsers(req: RequestWithQuery<QueryUserType>, res: Response<UsersPaginator>){
        const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = paginationUserQueries(req)
        const users: UsersPaginator = await usersQueryService.getUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        res.status(HTTP_CODES.OK_200).json(users)
    },
    async createUser(req: RequestWithBody<UserInputType>, res: Response<UserOutPutType | ErrorResponse>){
        const duplicateCredential: string | null = await usersService.findDuplicateCredential(req.body.login, req.body.email)
        if (duplicateCredential) {
            res.status(HTTP_CODES.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        field: duplicateCredential,
                        message: `${duplicateCredential} should be unique`,
                    },
                ],
            });
            return;
        }

        const newUser: UserOutPutType | null = await usersService.createUser(req.body)
        if(!newUser) {
            res.status(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_CODES.CREATED_201).json(newUser)
    },
    async deleteUser(req: RequestWithParams<URIParamsUserIdType>, res: Response) {
        const isDeleted: boolean = await usersService.deleteUser(req.params.id)
        if (!isDeleted) {
            res.sendStatus(HTTP_CODES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_CODES.NO_CONTENT_204)
    }
}