import { randomUUID } from 'node:crypto'
import { Password, Username } from './author-fields'

interface AuthorProps {
  id?: string
  name: string
  username: Username
  password: Password
  bio?: string
  createdAt?: Date
  deletedAt?: Date | null
  refreshToken?: string
  pictures?: []
}

export class Author {
  constructor(private props: AuthorProps) {
    this.props = {
      ...props,
      id: this.props.id ?? randomUUID(),
      createdAt: this.props.createdAt ?? new Date(),
    }
  }

  get id(): string {
    if (!this.props.id)
      throw new Error('It was not possible to access the object ID')
    return this.props.id
  }

  set name(name: string) {
    this.props.name = name
  }

  get name(): string {
    return this.props.name
  }

  set username(username: Username) {
    this.props.username = username
  }

  get username(): Username {
    return this.props.username
  }

  set password(password: Password) {
    this.props.password = password
  }

  get password(): Password {
    return this.props.password
  }

  set bio(bio: string | undefined) {
    this.props.bio = bio
  }

  get bio(): string | undefined {
    return this.props.bio
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get deletedAt(): Date | undefined | null {
    return this.props.deletedAt
  }

  delete() {
    if (this.props.deletedAt) throw new Error('There is already deleted')
    this.props.deletedAt = new Date()
  }

  unDoDelete() {
    this.props.deletedAt = null
  }
}