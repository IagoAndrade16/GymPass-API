import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, rep: FastifyReply) {
  await req.jwtVerify()

  return rep.status(200).send()
}
