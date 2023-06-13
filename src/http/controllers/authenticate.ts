import { InvalidCredentialsError } from '@/usecases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/usecases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
  const autenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = autenticateBodySchema.parse(req.body)

  try {
    const autenticateUseCase = makeAuthenticateUseCase()

    await autenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return rep.status(400).send({ message: err.message })
    }

    throw err
  }

  return rep.status(200).send()
}
