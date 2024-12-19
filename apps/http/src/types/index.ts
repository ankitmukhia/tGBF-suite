import z from 'zod';

export enum UserRole {
	ADMIN = "Admin",
	USER = "User"
}

export const signupSchema = z.object({
	username: z.string(),
	password: z.string().min(4),
	role: z.nativeEnum(UserRole)
})

export const signinSchema = z.object({
	username: z.string(),
	password: z.string().min(4),
})

export const updateMetadataSchema = z.object({
	avatarId: z.string()
})

export const paramsIdsSchema = z.object({
	userIds: z.array(z.string())
})

export const createSpaceSchema = z.object({
	name: z.string(),
	dimensions: z.string(),
	mapId: z.string().optional(),
})

export const addElementSchema = z.object({
	elementId: z.string(),
	spaceId: z.string(),
	x: z.number(),
	y: z.number(),
})

export const deleteElementSchema = z.object({
	id: z.string()
})

export const updateElementSchema = z.object({
	imageUrl: z.string(),
})

export const createElementSchema = z.object({
	imageUrl: z.string(),
	width: z.number(),
	height: z.number(),
	statics: z.boolean()
})

export const createAvatarSchema = z.object({
	imageUrl: z.string(),
	name: z.string()
})

export const createMapSchema = z.object({
	thumbnail: z.string(),
	dimensions: z.string(),
	name: z.string(),
	defaultElements: z.array(z.object({
		elementId: z.string(),
		x: z.number(),
		y: z.number(),
	}))
})
