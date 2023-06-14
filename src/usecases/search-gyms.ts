import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymsUseCaseInput {
  query: string
  page: number
}

interface SearchGymsUseCaseOutput {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseInput): Promise<SearchGymsUseCaseOutput> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
