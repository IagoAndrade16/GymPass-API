import { Gym, Prisma } from '@prisma/client'

export interface FinManyNearbyParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: FinManyNearbyParams): Promise<Gym[]>
}
