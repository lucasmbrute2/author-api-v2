import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { Author } from '../../entities/author'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { createAccessTokenAndRefreshToken } from '@/application/helpers/create-access-token-and-refresh-token'
import { inject, injectable } from 'tsyringe'
import { NotFoundError, Unauthorized } from '@/shared/errors/global-errors'

interface RefreshTokenUseCaseProps {
  refreshToken: string
  authorId: string
}

interface RefreshTokenUseCaseResponse {
  author: Author
  accessToken: string
  refreshToken: string
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('AuthorsRepository')
    private authorRepository: AuthorsRepository,
    @inject('RedisRepository')
    private redisClient: RedisRepository,
  ) {}

  async execute({
    authorId,
    refreshToken,
  }: RefreshTokenUseCaseProps): Promise<RefreshTokenUseCaseResponse> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new NotFoundError('Author not found')

    if (refreshToken !== author.refreshToken) {
      author.refreshToken = null
      await this.redisClient.delete(author.id)
      await this.authorRepository.save(author)
      throw new Unauthorized(
        'Refresh token does not match, please login in again',
      )
    }
    const { accessToken, refreshToken: createdRefreshToken } =
      createAccessTokenAndRefreshToken(author)

    author.refreshToken = createdRefreshToken.token

    await this.authorRepository.save(author)
    await this.redisClient.setValue(
      author.id,
      accessToken.token,
      accessToken.expirationTime,
    )

    return {
      author,
      accessToken: accessToken.token,
      refreshToken: createdRefreshToken.token,
    }
  }
}
