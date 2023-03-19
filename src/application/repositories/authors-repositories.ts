import { Author } from '../modules/author/entities/author'

export interface AuthorsRepository {
  create(author: Author): Promise<void>
  findByUsername(username: string): Promise<Author | null>
  save(author: Author): Promise<void>
}
