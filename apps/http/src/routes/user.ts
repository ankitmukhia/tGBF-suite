import { Router } from 'express'
export const userRouter: Router = Router()
import { userMiddleware } from '../middleware/userMiddleware'
import { userController } from '../controllers/user'

userRouter.post('/metadata', userMiddleware, userController.metaData)

userRouter.get('/metadata/bulk', userController.bulkMetadata)
