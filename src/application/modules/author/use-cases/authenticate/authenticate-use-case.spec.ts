import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAuthor } from '../../factory/make-author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'
import { AuthenticateUseCase } from './authenticate-use-case'

let sut: AuthenticateUseCase
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let redisMock: RedisMock

describe('Authenticate use case', () => {
  beforeEach(() => {
    redisMock = new RedisMock()
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    sut = new AuthenticateUseCase(inMemoryAuthorsRepository, redisMock)
  })

  it('should be able to authenticate an author', async () => {
    const author = makeAuthor()

    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    const response = await sut.execute({
      username: author.username,
      password: 'StrongPassword!123',
    })

    expect(response).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an author with wrong password ', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        username: author.username,
        password: 'Adkasd!4131',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an author with wrong username ', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        username: 'wrong-username@gmail.com',
        password: 'StrongPassword!123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  describe('JWT token', () => {
    it('should be able to store an access token', async () => {
      const author = makeAuthor()
      const incriptedPassword = await hash(author.password, 6)
      author.password = incriptedPassword

      await inMemoryAuthorsRepository.create(author)

      await sut.execute({
        username: author.username,
        password: 'StrongPassword!123',
      })

      const accessToken = await redisMock.getValue(author.id)
      expect(accessToken).toBeTruthy()
      expect(accessToken).toBeTypeOf('string')
    })

    it('should be able to delete an access token and generates a new one', async () => {
      const author = makeAuthor()
      const incriptedPassword = await hash(author.password, 6)
      author.password = incriptedPassword

      const oldAccessToken = 'random-fake-token'
      await redisMock.setValue(author.id, oldAccessToken, 100)

      await inMemoryAuthorsRepository.create(author)

      await sut.execute({
        username: author.username,
        password: 'StrongPassword!123',
      })

      const accessToken = await redisMock.getValue(author.id)
      await inMemoryAuthorsRepository.create(author)

      expect(oldAccessToken).not.toEqual(accessToken)
    })
  })
})
