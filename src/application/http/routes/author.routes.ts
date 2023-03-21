import { Router } from 'express'
import { AuthenticateController } from '../controllers/authors/authenticate'
import { ChangePasswordController } from '../controllers/authors/change-password'
import { LogoutController } from '../controllers/authors/logout'
import { RefreshTokenController } from '../controllers/authors/refresh'
import { RegisterController } from '../controllers/authors/register'
import { Authorization } from '../middlewares/ensure-authenticate'
import { validateAuthorBody } from '../middlewares/validate-author-body'

const authorRouter = Router()

const authorization = new Authorization()

const registerController = new RegisterController()
const authController = new AuthenticateController()
const logoutController = new LogoutController()
const changePasswordController = new ChangePasswordController()
const refreshTokenController = new RefreshTokenController()

authorRouter.post('/', validateAuthorBody, registerController.handle)
authorRouter.post('/session', validateAuthorBody, authController.handle)

// protected routes
authorRouter.get('/logout', authorization.ensureAuth, logoutController.handle)
authorRouter.patch(
  '/password',
  authorization.ensureAuth,
  changePasswordController.handle,
)

authorRouter.patch('/token/refresh', refreshTokenController.handle)

export { authorRouter }
