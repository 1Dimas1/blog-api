import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../../common/types/request.type";
import {Response} from "express";
import {QueryUserType, URIParamsUserIdType, UserInputType, UserViewType, UsersPaginationViewType} from "./user.type";
import {paginationUserQueries} from "../../common/helpers/pagination-values";
import UsersService from "./users-service";
import UsersQueryService from "./users-query-service";
import {HTTP_CODES} from "../../common/http.statuses";
import {inject, injectable} from "inversify";

@injectable()
export default class UsersController {
    constructor(
        @inject(UsersService)
        private usersService: UsersService,
        @inject(UsersQueryService)
        private usersQueryService: UsersQueryService,
    ) {}

    async getUsers(req: RequestWithQuery<QueryUserType>, res: Response<UsersPaginationViewType>){
        try {
            const {sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm} = paginationUserQueries(req)
            const users: UsersPaginationViewType = await this.usersQueryService.getUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
            res.status(HTTP_CODES.OK_200).json(users)
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async createUser(req: RequestWithBody<UserInputType>, res: Response<UserViewType | ErrorResponse>){
        try {
            const duplicateCredential: string | null = await this.usersService.findDuplicateCredential(req.body.login, req.body.email)
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

            const newUser: UserViewType | null = await this.usersService.createUser(req.body)
            if(!newUser) {
                res.status(HTTP_CODES.NOT_FOUND_404)
                return;
            }
            res.status(HTTP_CODES.CREATED_201).json(newUser)
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }

    async deleteUser(req: RequestWithParams<URIParamsUserIdType>, res: Response) {
        try {
            const isDeleted: boolean = await this.usersService.deleteUser(req.params.id)
            if (!isDeleted) {
                res.sendStatus(HTTP_CODES.NOT_FOUND_404)
                return;
            }
            res.sendStatus(HTTP_CODES.NO_CONTENT_204)
        } catch (error) {
            res.sendStatus(HTTP_CODES.INTERNAL_SERVER_ERROR_500);
        }
    }
}