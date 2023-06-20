import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { verifyJwt } from '../../middlewares/verifyJwt'
import { profile } from './profile'
import { register } from './register'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
