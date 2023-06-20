import { makeGetUserMetricsUseCase } from '@/usecases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(req: FastifyRequest, rep: FastifyReply) {
  const fetchUserCheckInsHistory = makeGetUserMetricsUseCase()

  const { checkInsCount } = await fetchUserCheckInsHistory.execute({
    userId: req.user.sub,
  })

  return rep.status(200).send({
    checkInsCount,
  })
}
