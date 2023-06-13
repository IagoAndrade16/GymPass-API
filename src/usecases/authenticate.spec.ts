import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepo: InMemoryUsersRepository
let sut: AuthenticateUseCase

beforeEach(() => {
  usersRepo = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepo)
})

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    await usersRepo.create({
      name: 'name',
      email: 'test@email.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'test@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepo.create({
      name: 'name',
      email: 'test@email.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      async () =>
        await sut.execute({
          email: 'wrong@email.com',
          password: '123456',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepo.create({
      name: 'name',
      email: 'test@email.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      async () =>
        await sut.execute({
          email: 'test@email.com',
          password: '654321',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
