import { Author } from '@/application/modules/author/entities/author'
import { inject } from 'tsyringe'
import { AuthorsRepository } from '../authors-repositories'
import { PrismaClient } from '@prisma/client'

export class PrismaAuthorsRepository implements AuthorsRepository {
  private prisma: PrismaClient

  constructor(@inject(PrismaClient) prisma: PrismaClient) {}

  async create(author: Author): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(author: Author): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByUsername(username: string): Promise<Author | null> {
    throw new Error('Method not implemented.')
  }

  async findById(authorId: string): Promise<Author | null> {
    throw new Error('Method not implemented.')
  }
}
