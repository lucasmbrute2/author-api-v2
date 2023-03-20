import { RegisterAuthorUseCase } from '@/application/modules/author/use-cases/register/register'
import { AuthorViewModel } from '@/application/views/author-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export class RegisterController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, password, username } = req.body

    const registerAuthorUseCase = container.resolve(RegisterAuthorUseCase)
    const { accessToken, author } = await registerAuthorUseCase.execute({
      name,
      password,
      username,
    })

    return res.json({
      author: AuthorViewModel.toHTTP(author),
      accessToken,
    })
  }
}
