import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAuthor } from '../../factory/make-author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'
import { LogoutUseCase } from './logout'

let sut: LogoutUseCase
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let redisMock: RedisMock

describe('Logout use case', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    redisMock = new RedisMock()
    sut = new LogoutUseCase(inMemoryAuthorsRepository, redisMock)
  })

  it('should be able to disconnect an author', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await sut.execute({
      authorId: author.id,
    })

    const authorToken = await redisMock.getValue(author.id)
    expect(authorToken).toBeFalsy()
  })

  it('should not be able to disconnect a not found author', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'random-id',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
