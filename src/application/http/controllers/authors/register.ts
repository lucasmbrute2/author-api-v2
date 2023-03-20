import { RegisterAuthorUseCase } from '@/application/modules/author/use-cases/register/register'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export class RegisterController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, password, username } = req.body

    const registerAuthorUseCase = container.resolve(RegisterAuthorUseCase)
    const { accessToken, author, refreshToken } =
      await registerAuthorUseCase.execute({
        name,
        password,
        username,
      })

    return res.json({
      accessToken,
      author,
      refreshToken,
    })
  }
}
