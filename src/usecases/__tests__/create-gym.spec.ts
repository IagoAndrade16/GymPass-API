import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from '../create-gym'

let gymsRepo: InMemoryGymsRepository
let sut: CreateGymUseCase

beforeEach(() => {
  gymsRepo = new InMemoryGymsRepository()
  sut = new CreateGymUseCase(gymsRepo)
})

describe('Create gym use case', () => {
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym title',
      description: 'gym description',
      phone: 'gym phone',
      latitude: -22.4992519,
      longitude: -44.1245343,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
