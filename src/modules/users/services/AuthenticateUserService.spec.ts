import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jose',
            email: 'jose@hotmail.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'jose@hotmail.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'jose@hotmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'Jose',
            email: 'jose@hotmail.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'jose@hotmail.com',
                password: '123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
