import {
  AccessTokenExpiration,
  RefreshTokenExpiration,
} from '@/application/helpers/token-expiration'
import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { Author } from '../../entities/author'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { sign } from 'jsonwebtoken'
import { env } from '@/application/env'
import { hash } from 'bcryptjs'
import { RedisRepository } from '@/application/repositories/redis-repository'

interface RegisterAuthorUseCaseProps {
  name: string
  username: string
  password: string
}

interface RegisterAuthorUseCaseResponse {
  author: Author
  accessToken: string
  refreshToken: string
}

export class RegisterAuthorUseCase {
  constructor(
    private authorRepository: AuthorsRepository,
    private redisClient: RedisRepository,
  ) {}

  async execute({
    name,
    password,
    username,
  }: RegisterAuthorUseCaseProps): Promise<RegisterAuthorUseCaseResponse> {
    const authorAlreadyExists = await this.authorRepository.findByUsername(
      username,
    )

    if (authorAlreadyExists) throw new UserAlreadyExistsError()

    const author = new Author({
      name,
      password,
      username,
    })

    const incryptedPassword = await hash(password, 6)
    author.password = incryptedPassword

    const accessTokenExpirationTime = new AccessTokenExpiration()
      .tokenExpirationInHours

    const accessToken = sign({}, env.JWT_SECRET, {
      expiresIn: `${accessTokenExpirationTime}h`,
      subject: author.id,
    })

    const refreshTokenExpirationTime = new RefreshTokenExpiration()
      .tokenExpirationInHours

    const refreshToken = sign({}, env.JWT_SECRET, {
      expiresIn: `${refreshTokenExpirationTime}h`,
      subject: author.id,
    })

    author.refreshToken = refreshToken

    await this.authorRepository.create(author)
    await this.redisClient.setValue(
      author.id,
      accessToken,
      accessTokenExpirationTime,
    )

    return {
      author,
      accessToken,
      refreshToken,
    }
  }
}
