import { env } from '@/application/env'
import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { PictureRepository } from '@/application/repositories/pictures-repository'
import { PrismaAuthorsRepository } from '@/application/repositories/prisma/prisma-authors-repository'
import { PrismaPicturesRepository } from '@/application/repositories/prisma/prisma-pictures-repository'
import { LocalStorageProvider } from '@/application/repositories/providers/storage/local-storage-provider'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { RedisProvider } from '@/application/repositories/redis/redis-provider'
import { StorageRepository } from '@/application/repositories/storage-repository'
import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'

const storage = {
  local: LocalStorageProvider,
  s3: '',
}

container.register<PrismaClient>(PrismaClient, {
  useValue: new PrismaClient(),
})

container.registerSingleton<RedisRepository>('RedisRepository', RedisProvider)
container.registerSingleton<AuthorsRepository>(
  'AuthorsRepository',
  PrismaAuthorsRepository,
)

container.registerSingleton<StorageRepository>(
  'StorageProvider',
  storage[env.STORAGE],
)

container.registerSingleton<PictureRepository>(
  'PictureRepository',
  PrismaPicturesRepository,
)
