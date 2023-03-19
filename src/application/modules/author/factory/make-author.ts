import { Author } from '../entities/author'

type PartialAuthor = Partial<Author>

export function makeAuthor(override?: PartialAuthor): Author {
  return new Author({
    name: 'John Doe',
    password: 'StrongPassword!123',
    username: 'johndoe@gmail.com',
    ...override,
  })
}
