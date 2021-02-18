import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProviderService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProviderService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('should be ableto list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'Jose',
            email: 'jose@hotmailcom',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Jose A',
            email: 'joseA@hotmailcom',
            password: '123456',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Jose',
            email: 'jose@hotmailcom',
            password: '123456',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
