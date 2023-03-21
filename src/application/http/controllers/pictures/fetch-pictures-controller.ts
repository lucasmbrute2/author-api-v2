import { FetchPicturesUseCase } from '@/application/modules/picture/use-cases/fetch-pictures/fetch-pictures-use-case'
import { PictureViewModel } from '@/application/views/picture-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export class FetchPicturesController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { authorId } = req
    const { page } = req.params
    const fetchPicturesUseCase = container.resolve(FetchPicturesUseCase)

    const { pictures } = await fetchPicturesUseCase.execute({
      authorId,
      page: page ? +page : undefined,
    })

    return res.status(200).json({
      pictures: pictures.map(PictureViewModel.toHTTP),
    })
  }
}
