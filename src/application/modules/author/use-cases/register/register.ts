import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { Author } from '../../entities/author'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { hash } from 'bcryptjs'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { createAccessTokenAndRefreshToken } from '@/application/helpers/create-access-token-and-refresh-token'

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

    const { accessToken, refreshToken } =
      createAccessTokenAndRefreshToken(author)

    author.refreshToken = refreshToken.token

    await this.authorRepository.create(author)
    await this.redisClient.setValue(
      author.id,
      accessToken.token,
      accessToken.expirationTime,
    )

    return {
      author,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    }
  }
}
