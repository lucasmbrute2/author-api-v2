import { Author } from '../modules/author/entities/author'

export interface AuthorsRepository {
  create(author: Author): Promise<void>
  save(author: Author): Promise<void>
  findByUsername(username: string): Promise<Author | null>
  findById(authorId: string): Promise<Author | null>
}
