import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPicturesUseCase } from './fetch-pictures-use-case'
import { InMemoryPictureRepository } from '@/application/repositories/in-memory/in-memory-picture-repository'
import { makeAuthor } from '@/application/modules/author/factory/make-author'
import { Picture } from '../../entities/picture'
import { makePicture } from '../../factory/make-picture'

let authorRepository: InMemoryAuthorsRepository
let pictureRepository: InMemoryPictureRepository
let sut: FetchPicturesUseCase

describe('Fetch pictures use case', () => {
  beforeEach(() => {
    authorRepository = new InMemoryAuthorsRepository()
    pictureRepository = new InMemoryPictureRepository()
    sut = new FetchPicturesUseCase(authorRepository, pictureRepository)
  })

  it('should be able to throw error if not find author', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'random-author-id',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should be able to get pictures by author', async () => {
    const author = makeAuthor()
    const picture = makePicture()

    // create 12 pictures to test pagination
    for (let i = 1; i <= 12; i++) {
      author.id = `author-${i}`
      await authorRepository.create(author)
      picture.authorId = author.id
      await pictureRepository.create(picture)
    }

    const response = await sut.execute({
      authorId: author.id,
      page: 2,
    })

    expect(response.pictures[0]).toBeInstanceOf(Picture)
    // the last 2 pictures from last page
    expect(response.pictures).toHaveLength(2)
    expect(response.pictures[0]).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          authorId: 'author-12',
        }),
      }),
    )
  })
})
