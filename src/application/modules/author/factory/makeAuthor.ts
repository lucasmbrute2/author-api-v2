import { Author } from '../entities/author'
import { Password, Username } from '../entities/author-fields'

type PartialAuthor = Partial<Author>

export function makeAuthor(override?: PartialAuthor): Author {
  return new Author({
    name: 'John Doe',
    password: new Password('StrongPassword!123'),
    username: new Username('johndoe@gmail.com'),
    ...override,
  })
}
