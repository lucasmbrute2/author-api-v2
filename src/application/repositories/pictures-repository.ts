import { Picture } from '../modules/picture/entities/picture'

export interface findManyByAuthorIdProps {
  authorId: string
  page: number
}

export interface PictureRepository {
  create(picture: Picture): Promise<void>
  delete(aliasKey: string): Promise<void>
  findByAliasKey(aliasKey: string): Promise<Picture | null>
  findManyByAuthorId({
    authorId,
    page,
  }: findManyByAuthorIdProps): Promise<Picture[]>
}
