import { Picture } from '@/application/modules/picture/entities/picture'
import { AppError } from '@/shared/errors/global-errors'
import fs from 'fs'
import { resolve } from 'path'
import { StorageRepository } from '../../storage-repository'

export class LocalStorageProvider implements StorageRepository {
  async create(file: Picture): Promise<void> {}

  async delete(aliasKey: string): Promise<void> {
    const fileName = resolve('tmp', aliasKey)

    try {
      await fs.promises.stat(fileName)
    } catch (error) {
      throw new AppError('Fail to delete image', 400)
    }

    await fs.promises.unlink(fileName)
  }
}
