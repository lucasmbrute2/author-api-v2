import { RegisterAuthorUseCase } from '@/application/modules/author/use-cases/register/register-use-case'
import { AuthorViewModel } from '@/application/views/author-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

interface RegisterControllerProps {
  name: string
  password: string
  username: string
}

export class RegisterController {
  async handle(
    req: Request<unknown, unknown, RegisterControllerProps>,
    res: Response,
  ): Promise<Response> {
    const { name, password, username } = req.body

    const registerAuthorUseCase = container.resolve(RegisterAuthorUseCase)
    const { accessToken, author, refreshToken } =
      await registerAuthorUseCase.execute({
        name,
        password,
        username,
      })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000 * 24, // 24h
      secure: true,
    })

    return res.status(201).json({
      author: AuthorViewModel.toHTTP(author),
      accessToken,
    })
  }
}
