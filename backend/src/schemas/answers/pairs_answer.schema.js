import z from 'zod'

const pairsAnswerSchema = z.object({
    question_id: z.union([
        z.string().uuid({ message: 'Invalid question ID format, must be a valid UUID' }),
        z.null()
    ]),

    left_item: z.string({
        invalid_type_error: 'Left item must be a string',
        required_error: 'Left item is required'
    }).min(1, { message: 'Left item must be at least 1 character long' })
      .max(300, { message: 'Left item cannot exceed 300 characters' }),

    right_item: z.string({
        invalid_type_error: 'Right item must be a string',
        required_error: 'Right item is required'
    }).min(1, { message: 'Right item must be at least 1 character long' })
      .max(300, { message: 'Right item cannot exceed 300 characters' }),
});


export function validatePairsAnswer(object){
    return pairsAnswerSchema.safeParse(object)
}