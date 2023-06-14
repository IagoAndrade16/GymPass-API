import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from '../search-gyms'

let gymsRepo: GymsRepository
let sut: SearchGymsUseCase

beforeEach(async () => {
  gymsRepo = new InMemoryGymsRepository()
  sut = new SearchGymsUseCase(gymsRepo)
})

describe('Search gyms use case', () => {
  it('should be able to search for gyms', async () => {
    await gymsRepo.create({
      title: 'gym title 1',
      description: 'gym description',
      phone: 'gym phone',
      latitude: -22.4992519,
      longitude: -44.1245343,
    })

    await gymsRepo.create({
      title: 'gym title 2',
      description: 'gym description',
      phone: 'gym phone',
      latitude: -22.4992519,
      longitude: -44.1245343,
    })

    const { gyms } = await sut.execute({
      query: '1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'gym title 1' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepo.create({
        title: `gym title ${i}`,
        description: 'gym description',
        phone: 'gym phone',
        latitude: -22.4992519,
        longitude: -44.1245343,
      })
    }

    const { gyms } = await sut.execute({
      query: 'title',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym title 21' }),
      expect.objectContaining({ title: 'gym title 22' }),
    ])
  })
})
