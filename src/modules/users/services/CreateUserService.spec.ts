import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsers: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        fakeCacheProvider = new FakeCacheProvider();

        createUsers = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });
    it('should be able to create a new user', async () => {
        const user = await createUsers.execute({
            name: 'Jose',
            email: 'jose@hotmailcom',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with email from another', async () => {
        await createUsers.execute({
            name: 'Jose',
            email: 'jose@hotmail.com',
            password: '123456',
        });

        await expect(
            createUsers.execute({
                name: 'Jose',
                email: 'jose@hotmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
