import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '../check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from '../errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'

let checkInsRepo: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

beforeEach(async () => {
  checkInsRepo = new InMemoryCheckInsRepository()
  gymsRepository = new InMemoryGymsRepository()
  sut = new CheckInUseCase(checkInsRepo, gymsRepository)

  vi.useFakeTimers()

  await gymsRepository.create({
    id: 'gym-01',
    title: 'gym',
    description: 'descripition',
    latitude: -22.4992519,
    longitude: -44.1245343,
    phone: '',
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Register use case', () => {
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.4992519,
      userLongitude: -44.1245343,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.4992519,
      userLongitude: -44.1245343,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.4992519,
        userLongitude: -44.1245343,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.4992519,
      userLongitude: -44.1245343,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.4992519,
      userLongitude: -44.1245343,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'gym',
      description: 'descripition',
      latitude: new Decimal(-22.4814881),
      longitude: new Decimal(-44.0621354),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.4992519,
        userLongitude: -44.1245343,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
