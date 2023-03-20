import { Author } from '@/application/modules/author/entities/author'
import { Author as rawAuthor } from '@prisma/client'

export class PrismaMapper {
  static toPrisma(author: Author): rawAuthor {
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

  static toDomain(rawAuthor: rawAuthor): Author {
    const {
      bio,
      created_at,
      deleted_at,
      id,
      name,
      password,
      refreshToken,
      username,
    } = rawAuthor

    return new Author({
      bio: bio ?? undefined,
      name,
      password,
      id,
      refreshToken: refreshToken ?? undefined,
      username,
      createdAt: created_at,
      deletedAt: deleted_at,
    })
  }
}
