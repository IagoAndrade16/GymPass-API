import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

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
})
