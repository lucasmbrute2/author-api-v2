import { env } from '@/application/env'
import { AuthorsRepository } from '@/application/repositories/authors-repository'
import { PrismaAuthorsRepository } from '@/application/repositories/prisma/prisma-authors-repository'
import { LocalStorageProvider } from '@/application/repositories/providers/storage/local-storage-provider'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { RedisProvider } from '@/application/repositories/redis/redis-provider'
import { StorageProvider } from '@/application/repositories/storage-repository'
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

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  storage[env.STORAGE],
)
