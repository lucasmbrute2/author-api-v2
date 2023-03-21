import { Picture } from '@/application/modules/picture/entities/picture'
import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import {
  findManyByAuthorIdProps,
  PictureRepository,
} from '../pictures-repository'
import { PrismaMapper } from './mappers/picture-mapper'

@injectable()
export class PrismaPicturesRepository implements PictureRepository {
  private prisma: PrismaClient

  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(picture: Picture): Promise<void> {
    await this.prisma.picture.create({
      data: PrismaMapper.toPrisma(picture),
    })
  }

  async delete(aliasKey: string): Promise<void> {
    await this.prisma.picture.delete({
      where: {
        alias_key: aliasKey,
      },
    })
  }

  async findByAliasKey(aliasKey: string): Promise<Picture | null> {
    const picture = await this.prisma.picture.findUnique({
      where: {
        alias_key: aliasKey,
      },
    })

    if (!picture) return null
    return PrismaMapper.toDomain(picture)
  }

  async findManyByAuthorId({
    authorId,
    page,
  }: findManyByAuthorIdProps): Promise<Picture[]> {
    const quantityOfResults = 10

    const pictures = await this.prisma.picture.findMany({
      where: {
        authorId,
      },

      take: quantityOfResults,
      skip: (page - 1) * quantityOfResults,
    })

    return pictures.map(PrismaMapper.toDomain)
  }
}
