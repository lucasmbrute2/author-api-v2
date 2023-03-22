import { CreatePictureUseCase } from '@/application/modules/picture/use-cases/create/create-use-case'
import { PictureViewModel } from '@/application/views/picture-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export class CreatePictureController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createPictureBoddySchema = z.object({
      path: z.string(),
      originalname: z.string(),
      filename: z.string(),
      size: z.coerce.number(),
      mimetype: z.string(),
    })

    const { filename, originalname, path } = createPictureBoddySchema.parse(
      req.file,
    )
    const { authorId } = req

    const createPictureUseCase = container.resolve(CreatePictureUseCase)
    const { picture } = await createPictureUseCase.execute({
      aliasKey: filename,
      htmlUrl: path,
      name: originalname,
      authorId,
    })

    return res.status(201).json({
      picture: PictureViewModel.toHTTP(picture),
    })
  }
}
