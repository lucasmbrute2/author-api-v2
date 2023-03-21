import { Router } from 'express'
import { CreatePictureController } from '../controllers/pictures/create'
import { authorRouter } from './author.routes'
import { picturesRoutes } from './picture.routes'
const route = Router()

const createPictureController = new CreatePictureController()

route.use('/author', authorRouter)
route.use('/picture', picturesRoutes, createPictureController.handle)

export { route }
