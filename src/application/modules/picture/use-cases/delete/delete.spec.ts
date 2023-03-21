import 'reflect-metadata'
import { InMemoryPictureRepository } from '@/application/repositories/in-memory/in-memory-picture-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageProvider } from '@/application/repositories/providers/storage/local-storage-provider'
import { DeletePictureUseCase } from './delete'

let storageProvider: LocalStorageProvider
let inMemoryPicturesRepository: InMemoryPictureRepository
let sut: DeletePictureUseCase

describe('Upload picture use case', () => {
  beforeEach(() => {
    inMemoryPicturesRepository = new InMemoryPictureRepository()
    storageProvider = new LocalStorageProvider()

    sut = new DeletePictureUseCase(storageProvider, inMemoryPicturesRepository)
  })

  it('should not be able to proceed with delete if picture was not found', async () => {
    await expect(() => sut.execute('random-alias-key')).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})
