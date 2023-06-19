import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
}
