import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetUserProfileUseCase } from '../get-user-profile'

let usersRepo: InMemoryUsersRepository
let sut: GetUserProfileUseCase

beforeEach(() => {
  usersRepo = new InMemoryUsersRepository()
  sut = new GetUserProfileUseCase(usersRepo)
})

describe('Get user profile use case', () => {
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepo.create({
      name: 'name',
      email: 'test@email.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('name')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(
      async () =>
        await sut.execute({
          userId: 'invalid id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
