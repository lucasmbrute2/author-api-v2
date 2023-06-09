import { Author } from '@/application/modules/author/entities/author'
import { AuthorsRepository } from '../authors-repository'

export class InMemoryAuthorsRepository implements AuthorsRepository {
  public authors: Author[] = []

  async create(author: Author): Promise<void> {
    this.authors.push(author)
  }

  async save(author: Author): Promise<void> {
    const authorIndex = this.authors.findIndex((a) => a.id === author.id)

    this.authors[authorIndex] = author
  }

  async findByUsername(username: string): Promise<Author | null> {
    const author = this.authors.find((author) => author.username === username)

    if (!author) return null
    return author
  }

  async findById(authorId: string): Promise<Author | null> {
    const author = this.authors.find((author) => author.id === authorId)

    if (!author) return null
    return author
  }
}
