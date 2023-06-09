import { AuthenticateUseCase } from '@/application/modules/author/use-cases/authenticate/authenticate-use-case'
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
    const { accessToken, refreshToken } =
      await authenticateAuthorUseCase.execute({
        username,
        password,
      })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24, // 24h
      secure: true,
    })

    return res.status(200).json({
      accessToken,
    })
  }
}
