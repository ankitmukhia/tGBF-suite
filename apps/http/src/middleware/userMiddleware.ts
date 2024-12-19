import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_TOKEN = "2d-metaverse"

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader?.split(" ")[1]

	if (!token) {
		res.status(401).json({
			message: "Unauthorized user..."
		})
		return
	}
	try {
		const verifyUser = jwt.verify(token, JWT_TOKEN) as Request;

		req.userId = verifyUser.userId
		next()
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong... Try again"
		})
	}
}

