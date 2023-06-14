import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from '../get-user-metrics'

let checkInsRepo: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

beforeEach(async () => {
  checkInsRepo = new InMemoryCheckInsRepository()
  sut = new GetUserMetricsUseCase(checkInsRepo)
})

describe('Get user metrics use case', () => {
  it('should be able to get check ins count from metrics', async () => {
    await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepo.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
