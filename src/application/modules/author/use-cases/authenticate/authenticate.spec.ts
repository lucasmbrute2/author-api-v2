import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { RedisMock } from '@/application/repositories/in-memory/redis-mock'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { Author } from '../../entities/author'
import { makeAuthor } from '../../factory/make-author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'
import { AuthenticateUseCase } from './authenticate'

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
      email: author.username,
      password: 'StrongPassword!123',
    })

    expect(response.author).toBeInstanceOf(Author)
    expect(response.author).toHaveProperty('id')
  })

  it('should not be able to authenticate an author with wrong password ', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        email: author.username,
        password: 'Adkasd!4131',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an author with wrong email ', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        email: 'wrong-email@gmail.com',
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
        email: author.username,
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
        email: author.username,
        password: 'StrongPassword!123',
      })

      const accessToken = await redisMock.getValue(author.id)
      await inMemoryAuthorsRepository.create(author)

      expect(oldAccessToken).not.toEqual(accessToken)
    })
  })
})
