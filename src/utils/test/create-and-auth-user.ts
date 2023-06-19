import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'name',
    email: 'email@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/session').send({
    email: 'email@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
