import { Picture } from '../modules/picture/entities/picture'

export interface StorageRepository {
  save(file: Picture): Promise<void>
  delete(fileKey: string): Promise<void>
}
