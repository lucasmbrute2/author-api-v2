import { Picture } from '@/application/modules/picture/entities/picture'
import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'tsyringe'
import { PictureRepository } from '../pictures-repository'
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
}
