import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { PictureRepository } from '@/application/repositories/pictures-repository'
import { StorageRepository } from '@/application/repositories/storage-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { inject, injectable } from 'tsyringe'
import { Picture, PictureProps } from '../../entities/picture'

interface UploadUseCaseResponse {
  picture: Picture
}

@injectable()
export class UploadUseCase {
  constructor(
    @inject('StorageProvider')
    private storageProvider: StorageRepository,
    @inject('AuthorRepository')
    private authorRepository: AuthorsRepository,
    @inject('PictureRepository')
    private pictureRepository: PictureRepository,
  ) {}

  async execute(
    file: PictureProps,
    authorId: string,
  ): Promise<UploadUseCaseResponse> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new NotFoundError('Author not found')

    const picture = new Picture({
      ...file,
      authorId,
    })

    await this.pictureRepository.create(picture)
    await this.storageProvider.create(picture)

    // picture.htmlUrl = `https://${enviromentVariables.aws.bucketName}.s3.${enviromentVariables.aws.region}.amazonaws.com/test/${picture.aliasKey}`

    return {
      picture,
    }
  }
}
