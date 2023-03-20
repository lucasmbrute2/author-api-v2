import { createAccessTokenAndRefreshToken } from '@/application/helpers/create-access-token-and-refresh-token'
import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { compare } from 'bcryptjs'
import { Author } from '../../entities/author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'

interface AuthenticateUseCaseProps {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  author: Author
  accessToken: string
  refreshToken: string
}

export class AuthenticateUseCase {
  constructor(
    private authorRepository: AuthorsRepository,
    private redisClient: RedisRepository,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseProps): Promise<AuthenticateUseCaseResponse> {
    const author = await this.authorRepository.findByUsername(email)
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
