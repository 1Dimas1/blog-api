import {SETTINGS} from "../src/settings";
import {authTestFactory} from "./helpers/auth/auth.test-factory";
import {UserDto} from "./helpers/users/user.test.type";
import {AuthTestRepository} from "./helpers/auth/auth.test-repository";
import {UserTestRepository} from "./helpers/users/user.test-repository";
import {req} from "./helpers/test.helpers";
import {HTTP_CODES} from "../src/common/http.statuses";

describe('auth', () => {
    let authRepository: AuthTestRepository;
    let userRepository: UserTestRepository;

    beforeEach(async () => {
        authRepository = new AuthTestRepository(req);
        userRepository = new UserTestRepository(req);
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
    });

    describe('POST /auth/login', () => {
        let user: UserDto;

        beforeEach(async () => {
            const createResponse = await userRepository.createUser({
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
            user = createResponse.body;
        });

        it('should return JWT token when logging in with email', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body).toEqual({
                accessToken: expect.any(String)
            });
        });

        it('should return JWT token when logging in with login', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'testuser',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body).toEqual({
                accessToken: expect.any(String)
            });
        });

        it('should return 400 with empty login or email', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: '',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toContainEqual({
                message: expect.any(String),
                field: 'loginOrEmail'
            });
        });

        it('should return 400 with empty password', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: ''
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toContainEqual({
                message: expect.any(String),
                field: 'password'
            });
        });

        it('should return 401 with incorrect password', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'wrongpassword'
            });

            const response = await authRepository.login(loginInput);
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 401 with non-existent user', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'nonexistent@example.com',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });
    });

    describe('GET /auth/me', () => {
        let user: UserDto;
        let accessToken: string;

        beforeEach(async () => {

            const createResponse = await userRepository.createUser({
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
            user = createResponse.body;

            const loginResponse = await authRepository.login({
                loginOrEmail: 'testuser',
                password: 'password123'
            });
            accessToken = loginResponse.body.accessToken;
        });

        it('should return user information with valid token', async () => {
            const response = await authRepository.getMe(accessToken);

            expect(response.status).toBe(HTTP_CODES.OK_200);
            expect(response.body).toEqual({
                email: user.email,
                login: user.login,
                userId: expect.any(String)
            });
        });

        it('should return 401 without token', async () => {
            const response = await authRepository.getMe();
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 401 with invalid token', async () => {
            const response = await authRepository.getMe('invalid_token');
            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 401 with expired token', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await authRepository.getMe(accessToken);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });
    });
});