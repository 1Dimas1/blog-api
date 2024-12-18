import {UserDto, UserInputDto} from "./user.test.type";
import {UserTestRepository} from "./user.test-repository";

export const userTestFactory = {
    createUserInputDto(): UserInputDto {
        return {
            login: 'testuser',
            password: 'password123',
            email: 'test@example.com'
        }
    },

    createInvalidUserInputDto(): UserInputDto {
        return {
            login: '',
            password: '',
            email: 'invalid-email'
        }
    },

    async createMultipleUsers(count: number, repository: UserTestRepository): Promise<UserDto[]> {
        const users: UserDto[] = [];
        for (let i = 1; i <= count; i++) {
            const userInput = {
                login: `user${i}`,
                password: 'password123',
                email: `user${i}@example.com`
            };
            const response = await repository.createUser(userInput);
            users.push(response.body);
            // Add delay between creations for sorting tests
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        return users;
    }
}