import { Request, Response } from 'express'
import { db } from '@repo/db/client'
import { createElementSchema, updateElementSchema, createAvatarSchema, createMapSchema } from '../types'

export const adminController = {
	async createElement(req: Request, res: Response) {
		const { imageUrl, width, height, statics } = req.body;

		const { success, data } = createElementSchema.safeParse({
			imageUrl,
			width,
			height,
			statics
		}
		)
		if (!success) {
			res.status(400).json({
				message: "Wrong cred!"
			})
			return
		}

		try {
			const element = await db.element.create({
				data: {
					imageUrl: data.imageUrl,
					width: data.width,
					height: data.height,
					static: data.statics
				}
			})
			res.status(200).json({
				id: element.id
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again!"
			})
		}

	},
	async updateGivenElement(req: Request, res: Response) {
		const { imageUrl } = req.body;

		const { success, data } = updateElementSchema.safeParse({
			imageUrl
		})

		if (!success) {
			res.status(400).json({
				message: "Invalid cred"
			})
			return
		}

		try {
			await db.element.update({
				where: {
					id: req.params.elementId
				},
				data: {
					imageUrl: data.imageUrl
				}
			})
			res.status(200).json({
				message: "Element updated successfully"
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again"
			})
		}

	},
	async createAvatar(req: Request, res: Response) {
		const { imageUrl, name } = req.body;

		const { success, data } = createAvatarSchema.safeParse({
			imageUrl,
			name
		})

		if (!success) {
			res.status(400).json({
				message: "Wrong cred!"
			})
			return
		}

		try {
			const createAvatar = await db.avatar.create({
				data: {
					imageUrl: data.imageUrl,
					name: data.name
				}
			})
			res.status(200).json({
				avatarId: createAvatar.id
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again"
			})
		}
	},
	async createMap(req: Request, res: Response) {
		const { thumbnail, dimensions, name, defaultElements } = req.body;

		const { success, data } = createMapSchema.safeParse({
			thumbnail, dimensions, name, defaultElements
		})

		if (!success) {
			res.status(400).json({
				message: "Wrong cred"
			})
			return
		}

		try {
			const map = await db.map.create({
				data: {
					name: data.name,
					width: parseInt(data.dimensions.split("x")[0]),
					height: parseInt(data.dimensions.split("x")[1]),
					mapElements: {
						create: data.defaultElements.map(e => ({
							elementId: e.elementId,
							x: e.x,
							y: e.y
						}))
					}
				}
			})
			res.status(200).json({
				id: map.id
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again"
			})
		}
	}
}
