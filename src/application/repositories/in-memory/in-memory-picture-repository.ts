import { Picture } from '@/application/modules/picture/entities/picture'
import { PictureRepository } from '../pictures-repository'

export class InMemoryPictureRepository implements PictureRepository {
  public pictures: Picture[] = []

  async save(picture: Picture): Promise<void> {
    this.pictures.push(picture)
  }

  async delete(aliasKey: string): Promise<void> {
    const pictureIndex = this.pictures.findIndex(
      (picture) => picture.aliasKey === aliasKey,
    )

    this.pictures.splice(pictureIndex, 1)
  }
}
