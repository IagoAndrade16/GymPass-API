import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('Search gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search a gym', async () => {
    const { token } = await createAndAuthUser(app)

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'Javascript Gym',
        phone: '119999999999',
        latitude: -22.4992519,
        longitude: -44.1245343,
        description: 'Some description',
      })

    await request(app.server)
      .post('/gyms')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'TypeScript Gym',
        phone: '119999999999',
        latitude: -22.4992519,
        longitude: -44.1245343,
        description: 'Some description',
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Javascript',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(200)

    expect(response.body.gyms).toEqual({
      gyms: [
        expect.objectContaining({
          title: 'Javascript Gym',
        }),
      ],
    })
  })
})
