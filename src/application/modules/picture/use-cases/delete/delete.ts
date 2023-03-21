import { PictureRepository } from '@/application/repositories/pictures-repository'
import { StorageRepository } from '@/application/repositories/storage-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { inject, injectable } from 'tsyringe'

type DeletePictureUseCaseResponse = void

@injectable()
export class DeletePictureUseCase {
  constructor(
    @inject('StorageProvider')
    private storageProvider: StorageRepository,
    @inject('PictureRepository')
    private pictureRepository: PictureRepository,
  ) {}

  async execute(aliasKey: string): Promise<DeletePictureUseCaseResponse> {
    const picture = await this.pictureRepository.findByAliasKey(aliasKey)
    if (!picture) throw new NotFoundError('Picture not found')

    await this.pictureRepository.delete(aliasKey)
    await this.storageProvider.delete(aliasKey)
  }
}
