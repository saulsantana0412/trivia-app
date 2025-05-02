import z from 'zod'

const idSchema = z.object({
    id: z.union([
        z.string().uuid({ message: 'Invalid ID format, must be a valid UUID' }),
        z.null()
    ])
})

export function validateIdFormat({id}){
    return idSchema.safeParse({id})
}