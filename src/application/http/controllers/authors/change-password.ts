import { ChangePasswordUseCase } from '@/application/modules/author/use-cases/change-password/change-password-use-case'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

interface ChangePasswordControllerProps {
  newPassword: string
  oldPassword: string
}

export class ChangePasswordController {
  async handle(
    req: Request<unknown, unknown, ChangePasswordControllerProps>,
    res: Response,
  ): Promise<Response> {
    const { authorId } = req
    const { newPassword, oldPassword } = req.body

    const changePasswordAuthorUseCase = container.resolve(ChangePasswordUseCase)
    await changePasswordAuthorUseCase.execute({
      authorId,
      newPassword,
      oldPassword,
    })

    return res.status(204).send()
  }
}
