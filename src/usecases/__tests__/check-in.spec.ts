import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from '../check-in'

let checkInsRepo: InMemoryCheckInsRepository
let sut: CheckInUseCase

beforeEach(() => {
  checkInsRepo = new InMemoryCheckInsRepository()
  sut = new CheckInUseCase(checkInsRepo)
})

describe('Register use case', () => {
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
