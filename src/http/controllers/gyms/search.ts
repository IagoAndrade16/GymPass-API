import { makeSearchGymsUseCase } from '@/usecases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(req: FastifyRequest, rep: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.coerce.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(req.query)

  const searchGymUseCase = makeSearchGymsUseCase()

  const gyms = await searchGymUseCase.execute({
    query: q,
    page,
  })

  return rep.status(200).send({
    gyms,
  })
}
