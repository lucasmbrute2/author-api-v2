import { createAccessTokenAndRefreshToken } from '@/application/helpers/create-access-token-and-refresh-token'
import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { compare } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'
import { Author } from '../../entities/author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'

interface AuthenticateUseCaseProps {
  username: string
  password: string
}

interface AuthenticateUseCaseResponse {
  author: Author
  accessToken: string
  refreshToken: string
}

@injectable()
export class AuthenticateUseCase {
  constructor(
    @inject('AuthorsRepository')
    private authorRepository: AuthorsRepository,
    @inject('RedisRepository')
    private redisClient: RedisRepository,
  ) {}

  async execute({
    username,
    password,
  }: AuthenticateUseCaseProps): Promise<AuthenticateUseCaseResponse> {
    const author = await this.authorRepository.findByUsername(username)
    if (!author) throw new InvalidCredentialsError()

    const doesPasswordsMatchs = await compare(password, author.password)
    if (!doesPasswordsMatchs) throw new InvalidCredentialsError()

    const { accessToken, refreshToken } =
      createAccessTokenAndRefreshToken(author)

    author.refreshToken = refreshToken.token
    await this.authorRepository.save(author)
    // reset access token in DB
    await this.redisClient.setValue(
      author.id,
      accessToken.token,
      refreshToken.expirationTime,
    )

    return {
      author,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    }
  }
}
