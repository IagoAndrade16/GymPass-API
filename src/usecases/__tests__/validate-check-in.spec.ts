import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ValidateCheckInUseCase } from '../validate-check-in'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let checkInsRepo: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

beforeEach(async () => {
  checkInsRepo = new InMemoryCheckInsRepository()
  sut = new ValidateCheckInUseCase(checkInsRepo)

  // vi.useFakeTimers()
})

afterEach(() => {
  // vi.useRealTimers()
})

describe('Validate check in use case', () => {
  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepo.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepo.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(async () =>
      sut.execute({
        checkInId: 'inexistent check in id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
