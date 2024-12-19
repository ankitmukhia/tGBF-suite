import { Router } from 'express';
export const spaceRouter: Router = Router();
import { useSpaceController } from '../controllers/space'
import { userMiddleware } from '../middleware/userMiddleware'

spaceRouter.post('/', userMiddleware, useSpaceController.createSpace)

spaceRouter.post('/element', userMiddleware, useSpaceController.addSpaceElement)

spaceRouter.get('/all', userMiddleware, useSpaceController.getAllSpaces)

spaceRouter.get('/:spaceId', userMiddleware, useSpaceController.getGivenSpace)

spaceRouter.delete('/element', userMiddleware, useSpaceController.deleteSpaceElement)

spaceRouter.delete('/:spaceId', userMiddleware, useSpaceController.deleteGivenSpace)




