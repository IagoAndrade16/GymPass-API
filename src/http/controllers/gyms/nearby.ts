import { makeFetchNearbyGymsUseCase } from '@/usecases/factories/make-fetch-nearby-gyms-use-case'
import { makeSearchGymsUseCase } from '@/usecases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(req: FastifyRequest, rep: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.body)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const gyms = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return rep.status(201).send({
    gyms,
  })
}
