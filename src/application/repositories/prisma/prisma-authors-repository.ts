import { Author } from '@/application/modules/author/entities/author'
import { inject, injectable } from 'tsyringe'
import { AuthorsRepository } from '../authors-repository'
import { PrismaClient } from '@prisma/client'
import { PrismaMapper } from './mappers/author-mapper'

@injectable()
export class PrismaAuthorsRepository implements AuthorsRepository {
  private prisma: PrismaClient

  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(author: Author): Promise<void> {
    await this.prisma.author.create({
      data: PrismaMapper.toPrisma(author),
    })
  }

  async save(author: Author): Promise<void> {
    await this.prisma.author.update({
      data: PrismaMapper.toPrisma(author),
      where: {
        id: author.id,
      },
    })
  }

  async findByUsername(username: string): Promise<Author | null> {
    const author = await this.prisma.author.findUnique({
      where: {
        username,
      },
    })

    if (!author) return null
    return PrismaMapper.toDomain(author)
  }

  async findById(authorId: string): Promise<Author | null> {
    const author = await this.prisma.author.findUnique({
      where: {
        id: authorId,
      },
    })
    if (!author) return null
    return PrismaMapper.toDomain(author)
  }
}
