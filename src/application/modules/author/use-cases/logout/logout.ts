import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { inject, injectable } from 'tsyringe'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'

interface LogoutUseCaseProps {
  authorId: string
}

@injectable()
export class LogoutUseCase {
  constructor(
    @inject('AuthorsRepository')
    private authorRepository: AuthorsRepository,
    @inject('RedisRepository')
    private redisClient: RedisRepository,
  ) {}

  async execute({ authorId }: LogoutUseCaseProps) {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new InvalidCredentialsError()

    author.refreshToken = null
    await this.redisClient.delete(author.id)
  }
}
