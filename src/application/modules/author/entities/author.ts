import { randomUUID } from 'node:crypto'
import { Picture } from '../../picture/entities/picture'

interface AuthorProps {
  id?: string
  name: string
  username: string
  password: string
  bio?: string
  createdAt?: Date
  deletedAt?: Date | null
  refreshToken?: string | null
  pictures?: Picture[]
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

  set username(username: string) {
    this.props.username = username
  }

  get username(): string {
    return this.props.username
  }

  set password(password: string) {
    this.props.password = password
  }

  get password(): string {
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
    if (!this.props.deletedAt) throw new Error('This author is not deleted')
    this.props.deletedAt = null
  }

  get pictures(): Picture[] | undefined {
    return this.props.pictures
  }

  set refreshToken(refreshToken: string | null | undefined) {
    this.props.refreshToken = refreshToken
  }

  get refreshToken(): string | null | undefined {
    return this.props.refreshToken
  }
}
