import { makeCheckInUseCase } from '@/usecases/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, rep: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })
  const createCheckinBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckinBodySchema.parse(req.body)
  const { gymId } = createCheckInParamsSchema.parse(req.query)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gymId,
    userId: req.user.sub,
  })

  return rep.status(201).send()
}
