import { Router, Request, Response } from 'express';
import { userMiddleware } from '../middleware/userMiddleware'
import { userController } from '../controllers/user'
import { userRouter } from './user';
import { spaceRouter } from './space';
import { adminRouter } from './admin'
import { db } from '@repo/db/client'

const router: Router = Router();

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

// get element
router.get('/elements', userMiddleware, async (req: Request, res: Response) => {
	try {
		const elements = await db.element.findMany({})
		res.status(200).json({
			elements: elements.map(e => ({
				id: e.id,
				imageUrl: e.imageUrl,
				width: e.width,
				height: e.height,
				static: e.static,
			}))
		})
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong... Try again"
		})
	}
})

// get avatar
router.get('/avatar', userMiddleware, async (req: Request, res: Response) => {
	try {
		const avatars = await db.avatar.findMany({})

		res.status(200).json({
			avatars: avatars.map(e => ({
				imageUrl: e.imageUrl,
				name: e.imageUrl,
			}))
		})
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong... Try again"
		})
	}
})

router.use('/user', userRouter)
router.use('/space', spaceRouter)
router.use('/admin', adminRouter)

export { router };
