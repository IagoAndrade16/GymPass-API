import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register use case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepo)

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'test@email.com',
      password: '123456',
    })

    const isPasswordConrrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordConrrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepo)

    const email = 'jonhdoe@example.com'

    await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: '123456',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'Jonh Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const usersRepo = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepo)

    const email = 'jonhdoe@example.com'

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
