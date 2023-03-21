import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { Author } from '../../entities/author'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { createAccessTokenAndRefreshToken } from '@/application/helpers/create-access-token-and-refresh-token'
import { inject, injectable } from 'tsyringe'
import {
  AppError,
  NotFoundError,
  Unauthorized,
} from '@/shared/errors/global-errors'
import { verify } from 'jsonwebtoken'
import { env } from '@/application/env'

interface RefreshTokenUseCaseProps {
  refreshToken: string
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
    refreshToken,
  }: RefreshTokenUseCaseProps): Promise<RefreshTokenUseCaseResponse> {
    let authorId = ''

    try {
      const { sub } = verify(refreshToken, env.JWT_SECRET)
      authorId = sub as string
    } catch (err) {
      throw new AppError(
        'Invalid refresh token, please try to sign up again',
        498,
      )
    }

    const author = await this.authorRepository.findById(authorId as string)
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
