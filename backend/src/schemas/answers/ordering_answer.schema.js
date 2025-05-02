import z from 'zod'

const orderingAnswerSchema = z.object({
    question_id: z.union([
        z.string().uuid({ message: 'Invalid question ID format, must be a valid UUID' }),
        z.null()
    ]),

    text: z.string({
        invalid_type_error: 'Answer text must be a string',
        required_error: 'Answer text is required'
    }).min(1, { message: 'Answer text must be at least 1 character long' })
      .max(300, { message: 'Answer text cannot exceed 300 characters' }),

    correct_position: z.number({
        invalid_type_error: 'Correct position must be a number',
        required_error: 'Correct position is required'
    }).int().positive({ message: 'Correct position must be a positive integer' })
});



export function validateOrderingAnswer(object){
    return orderingAnswerSchema.safeParse(object)
}