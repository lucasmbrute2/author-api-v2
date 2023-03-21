import { Picture } from '@/application/modules/picture/entities/picture'
import { Picture as rawPicture } from '@prisma/client'

export class PrismaMapper {
  static toPrisma(picture: Picture): rawPicture {
    const { aliasKey, authorId, createdAt, htmlUrl, id, name, deletedAt } =
      picture
    return {
      alias_key: aliasKey,
      authorId,
      created_at: createdAt ?? new Date(),
      deleted_at: deletedAt ?? null,
      html_url: htmlUrl,
      id,
      name,
    }
  }

  static toDomain(rawPicture: rawPicture): Picture {
    const { alias_key, authorId, created_at, deleted_at, html_url, id, name } =
      rawPicture

    return new Picture({
      aliasKey: alias_key,
      authorId,
      htmlUrl: html_url,
      name,
      createdAt: created_at,
      deletedAt: deleted_at,
      id,
    })
  }
}
