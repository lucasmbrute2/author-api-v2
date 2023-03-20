import { AuthorsRepository } from '@/application/repositories/authors-repositories'
import { compare, hash } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error'

interface ChangePasswordUseCaseProps {
  authorId: string
  oldPassword: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = void

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject('AuthorsRepository')
    private authorRepository: AuthorsRepository,
  ) {}

  async execute({
    authorId,
    oldPassword,
    newPassword,
  }: ChangePasswordUseCaseProps): Promise<ChangePasswordUseCaseResponse> {
    const author = await this.authorRepository.findById(authorId)
    if (!author) throw new InvalidCredentialsError()

    const doesPasswordsMatchs = await compare(oldPassword, author.password)
    if (!doesPasswordsMatchs) throw new InvalidCredentialsError()

    author.password = await hash(newPassword, 6)
    await this.authorRepository.save(author)
  }
}
