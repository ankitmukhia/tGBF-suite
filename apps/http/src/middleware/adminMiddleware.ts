import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_TOKEN = "2d-metaverse"

declare global {
	namespace Express {
		interface Request {
			adminId: string
			userId: string
			role: "Admin" | "User"
		}
	}
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeaders = req.headers["authorization"]
		const token = authHeaders?.split(" ")[1]

		if (!token) {
			res.status(401).json({
				message: "Unauthorized user"
			})
			return
		}

		const verifyAdmin = jwt.verify(token, JWT_TOKEN) as Request;
		if (!verifyAdmin || verifyAdmin?.role !== "Admin") {
			res.status(401).json({
				message: "Invalid admin"
			})
			return
		}
		req.adminId = verifyAdmin.adminId
		next()
	} catch (err) {
		res.status(401).json({
			message: "Something went wrrong... Try again!"
		})
	}
}
