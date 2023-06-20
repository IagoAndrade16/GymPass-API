import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(req: FastifyRequest, rep: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const token = await rep.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
      },
    },
  )

  const refreshToken = await rep.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return rep
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({
      token,
    })
}
