import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAuthor } from '../../factory/make-author'
import { RefreshTokenUseCase } from './refresh'
import { NotFoundError, Unauthorized } from '@/shared/errors/global-errors'
import { verify } from 'jsonwebtoken'
import { env } from '@/application/env'
import { Author } from '../../entities/author'

let sut: RefreshTokenUseCase
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let redisMock: RedisMock

describe('Authenticate use case', () => {
  beforeEach(() => {
    redisMock = new RedisMock()
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    sut = new RefreshTokenUseCase(inMemoryAuthorsRepository, redisMock)
  })

  it('should not be able refresh the token if author was not found', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'random-author-id',
        refreshToken: 'random-refresh-token',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should be able to delete any refresh from author if the informed does not matchs with the stored', async () => {
    const author = makeAuthor()

    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword
    await inMemoryAuthorsRepository.create(author)

    await redisMock.setValue(author.id, 'random-access-token', 100)

    await expect(() =>
      sut.execute({
        authorId: author.id,
        refreshToken: 'random-refresh-token',
      }),
    ).rejects.toBeInstanceOf(Unauthorized)

    const refreshTokenFromMemory = await redisMock.getValue(author.id)

    expect(refreshTokenFromMemory).toBeFalsy()
    expect(author.refreshToken).toBe(null)
    expect(inMemoryAuthorsRepository.authors[0].refreshToken).toBe(null)
  })

  it('should be able to save a new refresh token into Author table', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword
    author.refreshToken = 'new-refresh-token'

    await inMemoryAuthorsRepository.create(author)

    await sut.execute({
      authorId: author.id,
      refreshToken: 'new-refresh-token',
    })

    const refreshTokenFromMemory = await redisMock.getValue(author.id)
    const { sub: authorId } = verify(
      inMemoryAuthorsRepository.authors[0].refreshToken as string,
      env.JWT_SECRET,
    )

    expect(inMemoryAuthorsRepository.authors[0].refreshToken).not.toEqual(
      refreshTokenFromMemory,
    )
    expect(authorId).toEqual(author.id)
  })

  it('should be able to refresh token', async () => {
    const author = makeAuthor()

    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword
    author.refreshToken = 'new-refresh-token'
    await inMemoryAuthorsRepository.create(author)

    const response = await sut.execute({
      authorId: author.id,
      refreshToken: 'new-refresh-token',
    })

    console.log(response)

    expect(response.author).toBeInstanceOf(Author)
    expect(response.author).toHaveProperty('id')
    expect(response).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    )
  })
})
