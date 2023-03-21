import { randomUUID } from 'node:crypto'

export interface PictureProps {
  id?: string
  htmlUrl: string
  name: string
  aliasKey: string
  createdAt?: Date
  deletedAt?: Date | null
  authorId: string
}

export class Picture {
  constructor(private props: PictureProps) {
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

  set htmlUrl(htmlUrl: string) {
    this.props.htmlUrl = htmlUrl
  }

  get htmlUrl(): string {
    return this.props.htmlUrl
  }

  set name(name: string) {
    this.props.name = name
  }

  get name(): string {
    return this.props.name
  }

  set aliasKey(aliasKey: string) {
    this.props.aliasKey = aliasKey
  }

  get aliasKey(): string {
    return this.props.aliasKey
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

  set authorId(authorId: string) {
    this.props.authorId = authorId
  }

  get authorId(): string {
    return this.props.authorId
  }
}
