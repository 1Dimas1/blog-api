import {UserTestRepository} from "./helpers/users/user.test-repository";
import {req} from "./helpers/test.helpers";
import {HTTP_CODES, SETTINGS} from "../src/settings";
import {userTestFactory} from "./helpers/users/user.test-factory";
import {UserDto, UsersResponse} from "./helpers/users/user.test.type";

describe('/users', () => {
    let userRepository: UserTestRepository;

    beforeEach(async () => {
        userRepository = new UserTestRepository(req);
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
    });

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
    });

    describe('GET /users', () => {
        it('should return empty array when no users exist', async () => {
            const response = await userRepository.getAllUsers();

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body.items).toHaveLength(0);
        });

        describe('pagination and sorting', () => {
            jest.setTimeout(10000);

            beforeEach(async () => {
                await userTestFactory.createMultipleUsers(15, userRepository);
            });

            it('should return users with default pagination', async () => {
                const response = await userRepository.getAllUsers();
                const usersResponse: UsersResponse = response.body;

                expect(response.status).toBe(HTTP_CODES.OK_200);
                expect(usersResponse.items).toHaveLength(10);
                expect(usersResponse.page).toBe(1);
                expect(usersResponse.pageSize).toBe(10);
                expect(usersResponse.totalCount).toBe(15);
                expect(usersResponse.pagesCount).toBe(2);
            });

            it('should return second page with custom pageSize', async () => {
                const response = await userRepository.getAllUsers({
                    pageNumber: 2,
                    pageSize: 5
                });
                const usersResponse: UsersResponse = response.body;

                expect(usersResponse.items).toHaveLength(5);
                expect(usersResponse.page).toBe(2);
                expect(usersResponse.pageSize).toBe(5);
            });

            it('should sort users by createdAt in ascending order', async () => {
                const response = await userRepository.getAllUsers({
                    sortBy: 'createdAt',
                    sortDirection: 'asc'
                });

                const dates = response.body.items.map((user : UserDto) => new Date(user.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => a - b));
            });

            it('should sort users by createdAt in descending order', async () => {
                const response = await userRepository.getAllUsers({
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                });

                const dates = response.body.items.map((user : UserDto) => new Date(user.createdAt).getTime());
                expect(dates).toEqual([...dates].sort((a, b) => b - a));
            });
        });

        describe('search functionality', () => {
            beforeEach(async () => {
                await userTestFactory.createMultipleUsers(5, userRepository);
            });

            it('should search users by login term', async () => {
                const response = await userRepository.getAllUsers({
                    searchLoginTerm: 'user1'
                });

                expect(response.body.items.length).toBeGreaterThan(0);
                response.body.items.forEach((user : UserDto) => {
                    expect(user.login.toLowerCase()).toContain('user1');
                });
            });

            it('should search users by email term', async () => {
                const response = await userRepository.getAllUsers({
                    searchEmailTerm: 'user1'
                });

                expect(response.body.items.length).toBeGreaterThan(0);
                response.body.items.forEach((user : UserDto) => {
                    expect(user.email.toLowerCase()).toContain('user1');
                });
            });

            it('should return empty array when no matches found', async () => {
                const response = await userRepository.getAllUsers({
                    searchLoginTerm: 'nonexistent'
                });

                expect(response.body.items).toHaveLength(0);
            });
        });
    });

    describe('POST /users', () => {
        it('should create user with valid input', async () => {
            const userInput = userTestFactory.createUserInputDto();
            const response = await userRepository.createUser(userInput);

            expect(response.status).toBe(HTTP_CODES.CREATED_201);
            expect(response.body).toEqual({
                id: expect.any(String),
                login: userInput.login,
                email: userInput.email,
                createdAt: expect.any(String)
            });
        });

        it('should return 401 without authorization', async () => {
            const userInput = userTestFactory.createUserInputDto();
            const response = await req
                .post(SETTINGS.PATH.USERS)
                .send(userInput);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 400 for invalid input', async () => {
            const invalidInput = userTestFactory.createInvalidUserInputDto();
            const response = await userRepository.createUser(invalidInput);

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: 'login' }),
                    expect.objectContaining({ field: 'password' }),
                    expect.objectContaining({ field: 'email' })
                ])
            );
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete existing user', async () => {
            const createResponse = await userRepository.createUser(userTestFactory.createUserInputDto());
            const userId = createResponse.body.id;

            const deleteResponse = await userRepository.deleteUser(userId);
            expect(deleteResponse.status).toBe(HTTP_CODES.NO_CONTENT_204);

            const getResponse = await userRepository.getAllUsers();
            expect(getResponse.body.items).toHaveLength(0);
        });

        it('should return 404 for non-existent user', async () => {
            const response = await userRepository.deleteUser('647f76db548418d53ab66666');
            expect(response.status).toBe(HTTP_CODES.NOT_FOUND_404);
        });

        it('should return 401 without authorization', async () => {
            const response = await req
                .delete(SETTINGS.PATH.USERS.concat('/647f76db548418d53ab66666'));
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });
    });
});