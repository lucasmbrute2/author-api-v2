import { Router } from 'express'
import { RegisterController } from '../controllers/authors/register'

const authorRouter = Router()

const registerController = new RegisterController()

authorRouter.post('/', registerController.handle)

export { authorRouter }
