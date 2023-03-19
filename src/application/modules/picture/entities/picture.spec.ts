import { describe, expect, it } from 'vitest'
import { makePicture } from '../factory/make-picture'

describe('Picture entity', () => {
  it('should be able to instance a Picture', () => {
    const picture = makePicture()

    expect(picture).toHaveProperty('id')
    expect(picture).toEqual(
      expect.objectContaining({
        aliasKey: expect.any(String),
        htmlUrl: expect.any(String),
        name: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
  })

  describe('Delete picture', () => {
    it('should not be able to set a delete date from an picture already deleted', () => {
      const picture = makePicture()
      picture.delete()
      expect(() => picture.delete()).toThrow()
    })

    it('should be able to undo the delete from an picture', () => {
      const picture = makePicture()
      picture.delete()
      picture.unDoDelete()
    })

    it('should not able to undo the picture delete from an not deleted picture', () => {
      const picture = makePicture()
      expect(() => picture.unDoDelete()).toThrow()
    })
  })
})
