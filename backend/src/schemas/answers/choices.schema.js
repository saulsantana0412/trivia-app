import z from 'zod'

const choiceSchema = z.object({
    question_id: z.union([
        z.string().uuid({ message: 'Invalid question ID format, must be a valid UUID' }),
        z.null()
    ]),

    text: z.string({
        invalid_type_error: 'Choice text must be a string',
        required_error: 'Choice text is required'
    }).min(1, { message: 'Choice text must be at least 1 character long' })
      .max(300, { message: 'Choice text cannot exceed 300 characters' }),

    is_correct: z.boolean({
        invalid_type_error: 'Choice is_correct must be a boolean value (true or false)',
        required_error: 'Choice is_correct is required'
    })
});

export function validateChoice(object){
    return choiceSchema.safeParse(object)
}