import { Router } from 'express';
export const adminRouter: Router = Router();
import { adminController } from '../controllers/admin'
import { adminMiddleware } from '../middleware/adminMiddleware'

adminRouter.post('/element', adminMiddleware, adminController.createElement)

adminRouter.put('/element/:elementId', adminMiddleware, adminController.updateGivenElement)

adminRouter.post('/avatar', adminMiddleware, adminController.createAvatar)

adminRouter.post('/map', adminMiddleware, adminController.createMap)
