import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

let gymsRepo: GymsRepository
let sut: FetchNearbyGymsUseCase

beforeEach(async () => {
  gymsRepo = new InMemoryGymsRepository()
  sut = new FetchNearbyGymsUseCase(gymsRepo)
})

describe('Fetch nearby gyms use case', () => {
  it('should be able to fetch nearby gyms', async () => {
    await gymsRepo.create({
      title: 'Near gym',
      description: 'gym description',
      phone: 'gym phone',
      latitude: -22.4992519,
      longitude: -44.1245343,
    })

    await gymsRepo.create({
      title: 'Far gym',
      description: 'gym description',
      phone: 'gym phone',
      latitude: -22.8137413,
      longitude: -43.8095981,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.4992519,
      userLongitude: -44.1245343,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
