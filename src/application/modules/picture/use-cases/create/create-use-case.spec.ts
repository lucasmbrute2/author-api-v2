import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { InMemoryPictureRepository } from '@/application/repositories/in-memory/in-memory-picture-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { beforeEach, describe, expect, it } from 'vitest'
import { makePicture } from '../../factory/make-picture'
import { makeAuthor } from '@/application/modules/author/factory/make-author'
import { LocalStorageProvider } from '@/application/repositories/providers/storage/local-storage-provider'
import { CreatePictureUseCase } from './create-use-case'

let storageProvider: LocalStorageProvider
let inMemoryPicturesRepository: InMemoryPictureRepository
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let sut: CreatePictureUseCase

describe('Upload picture use case', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    inMemoryPicturesRepository = new InMemoryPictureRepository()
    storageProvider = new LocalStorageProvider()

    sut = new CreatePictureUseCase(
      storageProvider,
      inMemoryAuthorsRepository,
      inMemoryPicturesRepository,
    )
  })

  it('should not be able to proceed with upload if author was not found', async () => {
    const { aliasKey, htmlUrl, name } = makePicture()
    await expect(() =>
      sut.execute({
        aliasKey,
        authorId: 'random-author-id',
        htmlUrl,
        name,
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should be able to save a picture in database', async () => {
    const author = makeAuthor()
    const { aliasKey, htmlUrl, name } = makePicture()
    await inMemoryAuthorsRepository.create(author)

    await sut.execute({
      aliasKey,
      authorId: author.id,
      htmlUrl,
      name,
    })

    expect(inMemoryPicturesRepository.pictures).toHaveLength(1)
    expect(inMemoryPicturesRepository.pictures).toEqual([
      expect.objectContaining({
        authorId: expect.any(String),
        createdAt: expect.any(Date),
      }),
    ])
  })

  it('should be able to create a picture', async () => {
    const author = makeAuthor()
    await inMemoryAuthorsRepository.create(author)
    const { aliasKey, htmlUrl, name } = makePicture()

    const { picture: createdPicture } = await sut.execute({
      aliasKey,
      htmlUrl,
      name,
      authorId: author.id,
    })

    expect(createdPicture).toHaveProperty('id')
    expect(createdPicture).toHaveProperty('createdAt')
  })
})
