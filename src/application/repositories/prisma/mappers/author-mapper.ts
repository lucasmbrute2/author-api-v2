import { Author } from '@/application/modules/author/entities/author'
import { Author as rawAuthor } from '@prisma/client'

export class PrismaMapper {
  static ToPrisma(author: Author): rawAuthor {
    const {
      bio,
      id,
      name,
      username,
      refreshToken,
      password,
      createdAt,
      deletedAt,
    } = author

    return {
      bio: bio ?? null,
      created_at: createdAt ?? new Date(),
      deleted_at: deletedAt ?? null,
      id,
      name,
      password,
      refreshToken: refreshToken ?? null,
      username,
    }
  }
}
