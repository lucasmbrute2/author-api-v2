import 'reflect-metadata'
import { InMemoryAuthorsRepository } from '@/application/repositories/in-memory/in-memory-authors-repository'
import { InMemoryPictureRepository } from '@/application/repositories/in-memory/in-memory-picture-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageProvider } from '@/application/repositories/providers/storage/local-storage-provider'
import { DeletePictureUseCase } from './delete'
import { makeAuthor } from '@/application/modules/author/factory/make-author'
import { makePicture } from '../../factory/make-picture'

let storageProvider: LocalStorageProvider
let inMemoryPicturesRepository: InMemoryPictureRepository
let inMemoryAuthorsRepository: InMemoryAuthorsRepository
let sut: DeletePictureUseCase

describe('Upload picture use case', () => {
  beforeEach(() => {
    inMemoryAuthorsRepository = new InMemoryAuthorsRepository()
    inMemoryPicturesRepository = new InMemoryPictureRepository()
    storageProvider = new LocalStorageProvider()

    sut = new DeletePictureUseCase(
      storageProvider,
      inMemoryAuthorsRepository,
      inMemoryPicturesRepository,
    )
  })

  it('should not be able to proceed with delete if picture was not found', async () => {
    await expect(() => sut.execute('random-alias-key')).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('should be able to delete a picture', async () => {
    const author = makeAuthor()
    const picture = makePicture()
    await inMemoryAuthorsRepository.create(author)
    picture.authorId = author.id
    await inMemoryPicturesRepository.create(picture)

    await sut.execute(picture.aliasKey)

    expect(inMemoryPicturesRepository.pictures).toHaveLength(0)
  })
})
