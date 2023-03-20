import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { PrismaAuthorsRepository } from '@/application/repositories/prisma/prisma-authors-repository'
import { RedisRepository } from '@/application/repositories/redis-repository'
import { RedisProvider } from '@/application/repositories/redis/redis-provider'
import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'

container.register<PrismaClient>(PrismaClient, {
  useValue: new PrismaClient(),
})

container.registerSingleton<RedisRepository>('RedisRepository', RedisProvider)
container.registerSingleton<AuthorsRepository>(
  'AuthorsRepository',
  PrismaAuthorsRepository,
)
