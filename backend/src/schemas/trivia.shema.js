import z from 'zod'

const triviaSchema = z.object({
    id: z.union([
            z.string().uuid({ message: 'Invalid trivia ID format, must be a valid UUID' }),
            z.null()
        ]),

    title: z.string({
        invalid_type_error: 'Trivia title must be a string',
        required_error: 'Trivia title is required'
    }).min(3, { message: 'Trivia title must be at least 3 characters long' })
      .max(100, { message: 'Trivia title cannot exceed 100 characters' }),

    description: z.string({
        invalid_type_error: 'Trivia description must be a string',
        required_error: 'Trivia description is required'
    }).min(10, { message: 'Trivia description must be at least 10 characters long' })
      .max(500, { message: 'Trivia description cannot exceed 500 characters' }),

    category_id: z.string().uuid({ message: 'Invalid category ID format, must be a valid UUID' }),


    difficulty: z.string()
    .transform((val) => val.toLowerCase()) // Convierte a minúsculas antes de validar
    .refine((val) => ['easy', 'medium', 'hard'].includes(val), {
        message: 'Difficulty level must be one of: easy, medium, hard'
    }),

    created_by: z.string().uuid({ message: 'Invalid creator ID format, must be a valid UUID' }),

    is_competitive: z.boolean({
        invalid_type_error: 'is_competitive must be a boolean value'
    }),

    is_public: z.boolean({
        invalid_type_error: 'is_public must be a boolean value'
    }),

    questions: z.array(z.object({})).min(1, { message: 'There must be at least one question' })
});

export function validateTrivia(data){
    return triviaSchema.safeParse(data)
}

export function validatePartialTrivia(data){
    return triviaSchema.partial().safeParse(data)
}

