import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { compare, hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAuthor } from '../../factory/make-author'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'
import { ChangePasswordUseCase } from './change-password-use-case'

let sut: ChangePasswordUseCase
let inMemoryAuthorsRepository: InMemoryAuthorsRepository

describe('Change password use case', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    sut = new ChangePasswordUseCase(inMemoryAuthorsRepository)
  })

  it('should be able to change an author password', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await sut.execute({
      authorId: author.id,
      oldPassword: 'StrongPassword!123',
      newPassword: 'new-password',
    })

    const doesPasswordsMatchs = await compare(
      'new-password',
      inMemoryAuthorsRepository.authors[0].password,
    )

    expect(doesPasswordsMatchs).toBe(true)
  })

  it('should not be able to change password from an author with invalid ID', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'wrong ID',
        oldPassword: 'StrongPassword!123',
        newPassword: 'new-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to change a passowrd from an author that sent invalid old password', async () => {
    const author = makeAuthor()
    const incriptedPassword = await hash(author.password, 6)
    author.password = incriptedPassword

    await inMemoryAuthorsRepository.create(author)

    await expect(() =>
      sut.execute({
        authorId: author.id,
        oldPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
