import { Picture } from '../modules/picture/entities/picture'

export interface PictureRepository {
  save(picture: Picture): Promise<void>
  delete(aliasKey: string): Promise<void>
}
