import { Request, Response } from 'express'
import { signupSchema, signinSchema, updateMetadataSchema, paramsIdsSchema } from '../types'
import { db } from '@repo/db/client'
import { hash, compare } from '../scrypt'
import jwt from 'jsonwebtoken'

const JWT_TOKEN = "2d-metaverse"

interface ReqProps extends Request {
	username: string
	password: string
	type: string
}

export const userController = {
	async signup(req: Request, res: Response) {

		const { username, password, role } = req.body as ReqProps;

		const { success, data } = signupSchema.safeParse({
			username,
			password,
			role
		});

		if (!success) {
			res.status(401).json({
				message: "Worong cred.. Try again!",
			})
			return;
		}

		try {
			const existingUser = await db.user.findUnique({
				where: {
					username: data.username
				}
			})
			if (existingUser) {
				res.status(403).json({
					message: "Username already exists! Try different..."
				})
				return
			}
			const hashPassword = await hash(data.password);

			const createUser = await db.user.create({
				data: {
					username: data.username,
					password: hashPassword,
					role: data.role
				}
			})
			res.status(200).json({
				userId: createUser.id,
			})
		} catch (err) {
			console.log("error: ", err)
			res.status(500).json({
				message: "Signup failed... Try again",
			})
		}
	},

	async signin(req: Request, res: Response) {
		const { username, password } = req.body as ReqProps;

		const { success, data } = signinSchema.safeParse({
			username,
			password,
		});

		if (!success) {
			res.status(403).json({
				message: "Worong cred.. Try again!",
			})
			return;
		}

		try {
			const existingUser = await db.user.findUnique({
				where: {
					username: data.username
				}
			})

			if (!existingUser) {
				res.status(403).json({
					message: "Invalid username"
				})
				return
			}

			const checkHashPassword = compare(data.password, existingUser.password)

			if (!checkHashPassword) {
				res.status(403).json({
					message: "Invalid password!"
				})
				return
			}

			const payload = {
				userId: existingUser.id,
				role: existingUser.role
			}

			const token = jwt.sign(payload, JWT_TOKEN)

			res.status(200).json({
				token
			})
		} catch (err) {
			console.log("error: ", err)
			res.status(500).json({
				message: "Signin failed... Try again",
			})
		}
	},
	async metaData(req: Request, res: Response) {
		const { avatarId } = req.body;

		const { success, data } = updateMetadataSchema.safeParse({
			avatarId
		})

		if (!success) {
			res.status(401).json({
				message: "Worong cred.. Try again!",
			})
			return;
		}

		try {
			await db.user.update({
				where: {
					id: req.userId
				},
				data: {
					avatarId: data.avatarId
				}
			})
			res.status(200).json({
				message: "Updated"
			})
		} catch (err) {
			res.status(500).json({
				message: "Somethin went wrong... Try again!"
			})
		}
	},
	async bulkMetadata(req: Request, res: Response) {
		const userIdString = (req.query.ids) as string;
		// userid type is string
		console.log("user Id ", userIdString)
		const userIds = userIdString.slice(1, userIdString.length - 1).split(",")
		// [ "2", "3" ]
		const { success, data } = paramsIdsSchema.safeParse({
			userIds
		})

		if (!success) {
			res.status(401).json({
				message: "Worong ids.. Try again!",
			})
			return;
		}

		const avatars = await db.user.findMany({
			where: {
				id: {
					in: data.userIds
				}
			},
			select: {
				id: true,
				avatar: true
			}
		})
		console.log("avatars ", avatars)
		res.status(200).json({
			avatars: avatars.map(avatar => ({
				id: avatar.id,
				imageUrl: avatar.avatar?.imageUrl
			}))
		})
	}
}
