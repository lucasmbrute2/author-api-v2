import { Author } from '../modules/author/entities/author'

interface AuthorViewModelProps {
  bio: string
  id: string
  username: string
  name: string
  createdAt: Date
}

export class AuthorViewModel {
  static toHTTP(author: Author): AuthorViewModelProps {
    const { bio, id, username, name, createdAt } = author
    return { bio: bio ?? '', id, username, name, createdAt: createdAt as Date }
  }
}
