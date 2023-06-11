import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/usecases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const reigsterUseCase = new RegisterUseCase(usersRepository)

    await reigsterUseCase.execute({
      name,
      email,
      password,
    })
  } catch {
    return rep.status(409).send({ message: 'Email already exists' })
  }

  return rep.status(201).send()
}
