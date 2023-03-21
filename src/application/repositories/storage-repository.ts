import { Picture } from '../modules/picture/entities/picture'

export interface StorageRepository {
  create(file: Picture): Promise<void>
  delete(fileKey: string): Promise<void>
}
