import { Picture } from '../modules/picture/entities/picture'

interface PictureViewModelResponse {
  aliasKey: string
  id: string
  authorId: string
  createdAt?: Date
  deletedAt?: Date
  name: string
  htmlUrl: string
}

export class PictureViewModel {
  static toHTTP(picture: Picture): PictureViewModelResponse {
    const { aliasKey, authorId, createdAt, deletedAt, htmlUrl, id, name } =
      picture

    return {
      aliasKey,
      authorId,
      createdAt,
      htmlUrl,
      id,
      name,
      deletedAt: deletedAt ?? undefined,
    }
  }
}
