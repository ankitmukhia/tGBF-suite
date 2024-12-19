import { Request, Response } from 'express'
import { createSpaceSchema, deleteElementSchema, addElementSchema } from '../types'
import { db } from '@repo/db/client'

export const useSpaceController = {
	async createSpace(req: Request, res: Response) {
		const { name, dimensions, mapId } = req.body;

		const { success, data } = createSpaceSchema.safeParse({
			name,
			mapId,
			dimensions
		})

		if (!success) {
			res.status(401).json({
				message: "Wrong cred.. Try again!"
			})
			return
		}

		try {
			if (!data.mapId) {
				const space = await db.space.create({
					data: {
						name,
						width: parseInt(data.dimensions.split("x")[0]),
						height: parseInt(data.dimensions.split("x")[1]),
						creatorId: req.userId
					}
				})
				res.status(200).json({
					spaceId: space.id
				})
				return
			}

			const map = await db.map.findFirst({
				where: {
					id: data.mapId
				},
				select: {
					id: true,
					width: true,
					height: true,
					mapElements: true
				}
			})
			if (!map) {
				res.json(400).json({
					message: "Map not found"
				})
				return
			}

			const space = await db.$transaction(async () => {
				const space = await db.space.create({
					data: {
						name: data.name,
						width: map.width,
						height: map.height,
						creatorId: req.userId
					}
				})

				await db.spaceElements.createMany({
					data: map.mapElements.map(e => ({
						spaceId: space.id,
						elementId: e.elementId,
						x: e.x!,
						y: e.y!,
					}))
				})
				return space
			})
			res.status(200).json({
				spaceId: space.id
			})
		} catch (err) {
			console.log("error ", err)
			res.status(500).json({
				message: "Something went worng... Try again!"
			})
		}
	},
	async deleteGivenSpace(req: Request, res: Response) {
		const { spaceId } = req.params

		if (!spaceId) {
			res.status(400).json({
				message: "Wrong id"
			})
			return
		}

		try {
			const space = await db.space.findUnique({
				where: {
					id: spaceId
				}, select: {
					creatorId: true
				}
			})

			if (!space) {
				res.status(400).json({
					message: "Space doesn't exists!"
				})
				return
			}

			if (space.creatorId !== req.userId) {
				res.status(400).json({
					message: "Unauthorized"
				})
				return
			}

			await db.space.delete({
				where: {
					id: spaceId
				}
			})
			res.status(200).json({
				message: "Space deleted successfully"
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again!"
			})
		}
	},
	async deleteSpaceElement(req: Request, res: Response) {
		const { id } = req.body
		console.log("delete element Id", id)

		const { success, data } = deleteElementSchema.safeParse({
			id
		})

		if (!success) {
			res.json({
				message: "Id not provided"
			})
			return
		}

		try {
			const findElement = await db.spaceElements.findFirst({
				where: {
					id: data.id
				},
				select: {
					space: true
				}
			})
			if (!findElement || findElement.space.creatorId !== req.userId) {
				res.status(400).json({
					message: "Unauthorized"
				})
				return
			}

			const deletedElement = await db.spaceElements.delete({
				where: {
					id: data.id
				}
			})
			res.status(200).json({
				id: deletedElement.id
			})
		} catch (err) {
			res.status(500).json({
				message: "Something went wrong... Try again!"
			})
		}

	},
	async addSpaceElement(req: Request, res: Response) {
		const { elementId, spaceId, x, y } = req.body;
		const { success, data } = addElementSchema.safeParse({
			elementId,
			spaceId,
			x,
			y
		})

		console.log({
			elementId,
			spaceId,
			x,
			y
		})

		if (!success) {
			res.status(400).json({
				message: "Invalid elements cred!"
			})
			return
		}

		try {
			const space = await db.space.findUnique({
				where: {
					id: data.spaceId,
					creatorId: req.userId
				},
				select: {
					width: true,
					height: true
				}
			})

			//TODO:
			if (req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
				res.status(400).json({
					message: "Points are outside of boundary"
				})
				return
			}

			await db.spaceElements.create({
				data: {
					spaceId: data.spaceId,
					elementId: data.elementId,
					x: data.x,
					y: data.y
				}
			})
			res.status(200).json({
				message: "Element Added"
			})
		} catch (err) {

		}
	},
	/**
	* Get all spaces of creator
	* */
	async getAllSpaces(req: Request, res: Response) {
		console.log("user id ", req.userId)
		const findCreatorAllSpaces = await db.space.findMany({
			where: {
				creatorId: req.userId
			}
		})
		console.log("Space all ", findCreatorAllSpaces)
		res.status(200).json({
			spaces: findCreatorAllSpaces.map(e => ({
				id: e.id,
				elementId: e.name,
				thumbnail: e.thumbnail,
				dimensions: `${e.width}x${e.height}`
			}))
		})
	},
	async getGivenSpace(req: Request, res: Response) {
		const { spaceId } = req.params
		console.log({ spaceId })

		if (!spaceId) {
			res.status(400).json({
				message: "Privide Space Id"
			})
			return
		}

		try {
			const space = await db.space.findUnique({
				where: {
					id: spaceId
				},
				include: {
					elements: {
						include: {
							element: true
						}
					}
				}
			})
			if (!space) {
				res.status(400).json({
					message: "Spacee doesn't exists!"
				})
				return
			}
			res.status(200).json({
				dimensions: `${space.width}x${space.height}`,
				elements: space.elements.map(e => ({
					id: e.id,
					element: {
						imageUrl: e.element.imageUrl,
						static: false,
						height: 1,
						width: 1,
					},
					x: e.x,
					y: e.y,
				}))
			})
		} catch (err) {
			res.status(200).json({
				message: "Something went wrong... Try again!"
			})
		}
	}
}
