import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { verifyJwt } from '../../middlewares/verifyJwt'
import { profile } from './profile'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
