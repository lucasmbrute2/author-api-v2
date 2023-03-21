import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { PictureRepository } from '@/application/repositories/pictures-repository'
import { StorageRepository } from '@/application/repositories/storage-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { inject, injectable } from 'tsyringe'
import { Picture } from '../../entities/picture'

interface CreatePictureUseCaseProps {
  aliasKey: string
  htmlUrl: string
  name: string
  authorId: string
}

interface CreatePictureUseCaseResponse {
  picture: Picture
}

@injectable()
export class CreatePictureUseCase {
  constructor(
    @inject('StorageProvider')
    private storageProvider: StorageRepository,
    @inject('AuthorsRepository')
    private authorRepository: AuthorsRepository,
    @inject('PictureRepository')
    private pictureRepository: PictureRepository,
  ) {}

  async execute({
    aliasKey,
    htmlUrl,
    name,
    authorId,
  }: CreatePictureUseCaseProps): Promise<CreatePictureUseCaseResponse> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new NotFoundError('Author not found')

    const picture = new Picture({
      aliasKey,
      htmlUrl,
      name,
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
