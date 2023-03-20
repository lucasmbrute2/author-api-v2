import { LogoutUseCase } from '@/application/modules/author/use-cases/logout/logout'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

interface LogoutControllerProps {
  name: string
  password: string
  username: string
}

export class LogoutController {
  async handle(
    req: Request<unknown, unknown, LogoutControllerProps>,
    res: Response,
  ): Promise<Response> {
    const { authorId } = req

    const LogoutAuthorUseCase = container.resolve(LogoutUseCase)
    await LogoutAuthorUseCase.execute({
      authorId,
    })

    return res.status(200).send()
  }
}
