import multer from 'multer'
import { Router } from 'express'
import { multerConfigs } from '@/application/constraints/upload-multer'
import { Authorization } from '../middlewares/ensure-authenticate'

const picturesRoutes = Router()
const authorization = new Authorization()

const upload = multer(multerConfigs)

picturesRoutes.post('/', authorization.ensureAuth, upload.single('picture'))

export { picturesRoutes }
