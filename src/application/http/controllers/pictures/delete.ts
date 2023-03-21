import { DeletePictureUseCase } from '@/application/modules/picture/use-cases/delete/delete'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export class DeletePictureController {
  async handle(req: Request, res: Response): Promise<Response> {
    const deletePictureUseCase = container.resolve(DeletePictureUseCase)
    const { aliasKey } = req.params

    await deletePictureUseCase.execute(aliasKey)

    return res.status(200).send()
  }
}
