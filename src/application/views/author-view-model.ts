import { Author } from '../modules/author/entities/author'

interface AuthorViewModelResponse {
  bio: string
  id: string
  username: string
  name: string
  createdAt: Date
}

export class AuthorViewModel {
  static toHTTP(author: Author): AuthorViewModelResponse {
    const { bio, id, username, name, createdAt } = author
    return { bio: bio ?? '', id, username, name, createdAt: createdAt as Date }
  }
}
