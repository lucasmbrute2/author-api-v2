import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAuthor } from '../../factory/make-author'
import { RefreshTokenUseCase } from './refresh'
import {
  AppError,
  NotFoundError,
  Unauthorized,
} from '@/shared/errors/global-errors'
import { sign, verify } from 'jsonwebtoken'
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
    const author = makeAuthor()
    const refreshToken = sign({}, env.JWT_SECRET, {
      subject: 'random-author-id',
    })
    author.refreshToken = refreshToken

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        refreshToken,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to proceed without a valid refresh token', async () => {
    await expect(() =>
      sut.execute({
        refreshToken: 'invalid-refresh-token',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to delete the refresh token from author if the informed does not matchs with the stored and should delete it', async () => {
    const author = makeAuthor()

    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword
    await inMemoryAuthorsRepository.create(author)

    const refreshToken = sign({}, env.JWT_SECRET, {
      subject: author.id,
    })

    await redisMock.setValue(author.id, 'random-refresh-token', 100)

    await expect(() =>
      sut.execute({
        refreshToken,
      }),
    ).rejects.toBeInstanceOf(Unauthorized)

    const refreshTokenFromMemory = await redisMock.getValue(author.id)

    expect(refreshTokenFromMemory).toBeFalsy()

    // delete refresh token that does not matchs expectations from especified author
    expect(author.refreshToken).toBe(null)
    expect(inMemoryAuthorsRepository.authors[0].refreshToken).toBe(null)
  })

  it('should be able to save a new refresh token into Author table', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    const refreshToken = sign({}, env.JWT_SECRET, {
      subject: author.id,
    })
    author.refreshToken = refreshToken

    await inMemoryAuthorsRepository.create(author)
    await sut.execute({
      refreshToken,
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
    const refreshToken = sign({}, env.JWT_SECRET, {
      subject: author.id,
    })
    author.refreshToken = refreshToken
    await inMemoryAuthorsRepository.create(author)

    const response = await sut.execute({
      refreshToken,
    })

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
