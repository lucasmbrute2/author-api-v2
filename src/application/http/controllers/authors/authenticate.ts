import { AuthenticateUseCase } from '@/application/modules/author/use-cases/authenticate/authenticate'
import { AuthorViewModel } from '@/application/views/author-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

interface AuthenticateControllerProps {
  username: string
  password: string
}

export class AuthenticateController {
  async handle(
    req: Request<unknown, unknown, AuthenticateControllerProps>,
    res: Response,
  ): Promise<Response> {
    const { username, password } = req.body

    const authenticateAuthorUseCase = container.resolve(AuthenticateUseCase)
    const { accessToken, author, refreshToken } =
      await authenticateAuthorUseCase.execute({
        username,
        password,
      })

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    })

    return res.status(200).json({
      author: AuthorViewModel.toHTTP(author),
      accessToken,
    })
  }
}
