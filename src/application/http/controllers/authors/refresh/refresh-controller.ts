import { RefreshTokenUseCase } from '@/application/modules/author/use-cases/refresh-token/refresh-token-use-case'
import { AuthorViewModel } from '@/application/views/author-view-model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies

    const refreshTokenAuthorUseCase = container.resolve(RefreshTokenUseCase)
    const {
      accessToken,
      author,
      refreshToken: newRefreshToken,
    } = await refreshTokenAuthorUseCase.execute({
      refreshToken,
    })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 24h
      secure: true,
    })

    return res.status(200).json({
      author: AuthorViewModel.toHTTP(author),
      accessToken,
    })
  }
}
