import { Author } from '@/application/modules/author/entities/author'
import { AuthorsRepository } from '../authors-repositories'

export class InMemoryAuthorsRepository implements AuthorsRepository {
  public authors: Author[] = []

  async create(author: Author): Promise<void> {
    this.authors.push(author)
  }

  async findByUsername(username: string): Promise<Author | null> {
    const author = this.authors.find(
      (author) => author.username.value === username,
    )

    if (!author) return null
    return author
  }
}
