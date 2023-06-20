import { makeValidateCheckInsUseCase } from '@/usecases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(req: FastifyRequest, rep: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(req.params)

  const validateCheckInUseCase = makeValidateCheckInsUseCase()

  await validateCheckInUseCase.execute({
    checkInId,
  })

  return rep.status(204).send()
}
