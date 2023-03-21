import { Picture } from '@/application/modules/picture/entities/picture'
import { PictureRepository } from '../pictures-repository'

export class InMemoryPictureRepository implements PictureRepository {
  public pictures: Picture[] = []

  async create(picture: Picture): Promise<void> {
    this.pictures.push(picture)
  }

  async delete(aliasKey: string): Promise<void> {
    const pictureIndex = this.pictures.findIndex(
      (picture) => picture.aliasKey === aliasKey,
    )

    this.pictures.splice(pictureIndex, 1)
  }

  async findByAliasKey(aliasKey: string): Promise<Picture | null> {
    const picture = this.pictures.find(
      (picture) => picture.aliasKey === aliasKey,
    )
    if (!picture) return null

    return picture
  }
}
