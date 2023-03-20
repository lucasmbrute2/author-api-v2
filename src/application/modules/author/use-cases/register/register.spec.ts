import { env } from '@/application/env'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { compare } from 'bcryptjs'
import { verify } from 'jsonwebtoken'
import { beforeEach, describe, expect, it } from 'vitest'
import { Author } from '../../entities/author'
import { makeAuthor } from '../../factory/make-author'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { RegisterAuthorUseCase } from './register'

let sut: RegisterAuthorUseCase
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let redisMock: RedisMock

describe('Register author use case', () => {
  beforeEach(() => {
    redisMock = new RedisMock()
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    sut = new RegisterAuthorUseCase(inMemoryAuthorsRepository, redisMock)
  })

  it('it should be able to register an Author', async () => {
    const { name, username, password } = makeAuthor()

    const response = await sut.execute({
      name,
      password,
      username,
    })

    expect(inMemoryAuthorsRepository.authors).toHaveLength(1)
    expect(inMemoryAuthorsRepository.authors[0]).toBeInstanceOf(Author)
    expect(response).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    )
  })

  it('should not be able to register an already registered author', async () => {
    const { name, username, password } = makeAuthor()
    await sut.execute({
      name,
      password,
      username,
    })

    await expect(() =>
      sut.execute({
        name,
        password,
        username,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it("should hash author's passwords upon registration", async () => {
    const { name, username, password } = makeAuthor()
    const { author } = await sut.execute({
      name,
      password,
      username,
    })

    const isPasswordCorrectlyHashed = await compare(password, author.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  describe('JWT token', () => {
    it('should be able to save and retrive the author access token', async () => {
      const { name, username, password } = makeAuthor()
      const { accessToken, author } = await sut.execute({
        name,
        password,
        username,
      })

      const savedAccesToken = await redisMock.getValue(author.id)
      expect(savedAccesToken).toEqual(accessToken)
    })

    it('should be able to create a valid JWT access token', async () => {
      const { name, username, password } = makeAuthor()
      const { accessToken, author } = await sut.execute({
        name,
        password,
        username,
      })

      const isTokenValid = verify(accessToken, env.JWT_SECRET)

      expect(isTokenValid.sub).toEqual(author.id)
    })

    it('should be able to create a valid JWT refresh token', async () => {
      const { name, username, password } = makeAuthor()
      const { refreshToken, author } = await sut.execute({
        name,
        password,
        username,
      })

      const isTokenValid = verify(refreshToken, env.JWT_SECRET)

      expect(isTokenValid.sub).toEqual(author.id)
    })
  })
})
