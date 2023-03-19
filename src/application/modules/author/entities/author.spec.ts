import { describe, expect, it } from 'vitest'
import { makeAuthor } from '../factory/makeAuthor'
import { Password, Username } from './author-fields'

describe('Author entity', () => {
  it('should be able to instance an Author', () => {
    const author = makeAuthor()

    expect(author).toHaveProperty('id')
    expect(author).toHaveProperty('createdAt')
    expect(author.password).toBeInstanceOf(Password)
    expect(author.username).toBeInstanceOf(Username)
    expect(author).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        password: expect.objectContaining({
          field: expect.any(String),
        }),
        username: expect.objectContaining({
          field: expect.any(String),
        }),
      }),
    )
  })

  it('should not be able to instance an Author with username in wrong format', () => {
    expect(() =>
      makeAuthor({
        username: new Username('wrong-username-format'),
      }),
    ).toThrow()
  })

  it('should not be able to instance an Author with password in wrong format', () => {
    expect(() =>
      makeAuthor({
        password: new Password('wrong-password-format'),
      }),
    )
  })

  describe('Delete author', () => {
    it('should not be able to set a delete date from an author already deleted', () => {
      const author = makeAuthor()
      author.delete()
      expect(() => author.delete()).toThrow()
    })

    it('should be able to undo the delete from an author', () => {
      const author = makeAuthor()
      author.delete()
      author.unDoDelete()
    })

    it('should not able to undo the author delete from an not deleted author', () => {
      const author = makeAuthor()
      expect(() => author.unDoDelete()).toThrow()
    })
  })
})
