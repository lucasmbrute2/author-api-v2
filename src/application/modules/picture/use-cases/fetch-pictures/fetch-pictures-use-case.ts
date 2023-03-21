import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { PictureRepository } from '@/application/repositories/pictures-repository'
import { NotFoundError } from '@/shared/errors/global-errors'
import { inject, injectable } from 'tsyringe'
import { Picture } from '../../entities/picture'

interface FetchPicturesUseCaseProps {
  authorId: string
  page?: number
}

interface FetchPicturesUseCaseResponse {
  pictures: Picture[]
}

@injectable()
export class FetchPicturesUseCase {
  constructor(
    @inject('AuthorsRepository')
    private authorsRepository: AuthorsRepository,
    @inject('PictureRepository')
    private pictureRepository: PictureRepository,
  ) {}

  async execute({
    authorId,
    page = 1,
  }: FetchPicturesUseCaseProps): Promise<FetchPicturesUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId)

    if (!author)
      throw new NotFoundError(
        'Author not found, please inform a valid author ID',
      )

    const pictures = await this.pictureRepository.findManyByAuthorId({
      authorId,
      page,
    })

    return {
      pictures,
    }
  }
}
