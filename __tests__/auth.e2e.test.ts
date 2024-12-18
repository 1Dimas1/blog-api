import {HTTP_CODES, SETTINGS} from "../src/settings";
import {authTestFactory} from "./helpers/auth/auth.test-factory";
import {UserDto} from "./helpers/users/user.test.type";
import {LoginInputDto} from "./helpers/auth/auth.test.type";
import {AuthTestRepository} from "./helpers/auth/auth.test-repository";
import {UserTestRepository} from "./helpers/users/user.test-repository";
import {req} from "./helpers/test.helpers";

describe('auth/login', () => {
    let authRepository: AuthTestRepository;
    let userRepository: UserTestRepository;

    beforeEach(async () => {
        authRepository = new AuthTestRepository(req);
        userRepository = new UserTestRepository(req);
        await req.delete(SETTINGS.PATH.TESTING.concat('/all-data')).expect(HTTP_CODES.NO_CONTENT_204);
    });

    describe('successful login', () => {
        let user: UserDto;

        beforeEach(async () => {
            // Create a user first
            const createResponse = await userRepository.createUser({
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
            user = createResponse.body;
        });

        it('should login with correct email and password', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
        });

        it('should login with correct login and password', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'testuser',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
        });
    });

    describe('invalid credentials', () => {
        let user: UserDto;

        beforeEach(async () => {
            // Create a user first
            const createResponse = await userRepository.createUser({
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
            user = createResponse.body;
        });

        it('should return 401 with incorrect password', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'wrongpassword'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 401 with non-existent email', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'nonexistent@example.com',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });

        it('should return 401 with non-existent login', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'nonexistentuser',
                password: 'password123'
            });

            const response = await authRepository.login(loginInput);

            expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
        });
    });

    describe('input validation', () => {
        it('should return 400 when loginOrEmail is empty', async () => {
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

        it('should return 400 when password is empty', async () => {
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

        it('should return 400 when both fields are missing', async () => {
            const response = await authRepository.login({} as LoginInputDto);

            expect(response.status).toBe(HTTP_CODES.BAD_REQUEST_400);
            expect(response.body.errorsMessages).toHaveLength(2);
            expect(response.body.errorsMessages).toContainEqual({
                message: expect.any(String),
                field: 'loginOrEmail'
            });
            expect(response.body.errorsMessages).toContainEqual({
                message: expect.any(String),
                field: 'password'
            });
        });
    });

    describe('rate limiting', () => {
        let user: UserDto;

        beforeEach(async () => {
            const createResponse = await userRepository.createUser({
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            });
            user = createResponse.body;
        });

        it('should handle multiple consecutive login attempts', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'password123'
            });

            // Multiple successful logins
            for (let i = 0; i < 5; i++) {
                const response = await authRepository.login(loginInput);
                expect(response.status).toBe(HTTP_CODES.NO_CONTENT_204);
                // Add small delay between requests
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        });

        it('should handle multiple failed login attempts', async () => {
            const loginInput = authTestFactory.createLoginInputDto({
                loginOrEmail: 'test@example.com',
                password: 'wrongpassword'
            });

            // Multiple failed attempts
            for (let i = 0; i < 5; i++) {
                const response = await authRepository.login(loginInput);
                expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED_401);
                // Add small delay between requests
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        });
    });
});