import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'

interface ChangePasswordUseCaseProps {
  authorId: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = void

export class ChangePasswordUseCase {
  constructor(private authorRepository: AuthorsRepository) {}

  async execute({
    authorId,
    newPassword,
  }: ChangePasswordUseCaseProps): Promise<ChangePasswordUseCaseResponse> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new InvalidCredentialsError()

    author.password = await hash(newPassword, 6)
    await this.authorRepository.save(author)
  }
}
