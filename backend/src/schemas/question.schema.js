import z from 'zod'

const validExtensions = /\.(jpeg|jpg|png|gif|mp4|mov|avi|webm)$/i;

const questionSchema = z.object({
    id: z.union([
        z.string().uuid({ message: 'Invalid question ID format, must be a valid UUID' }),
        z.null()
    ]),
    
    text: z.string({
        invalid_type_error: 'Question text must be a string',
        required_error: 'Question text is required'
    }).min(5, { message: 'Question text must be at least 5 characters long' })
      .max(500, { message: 'Question text cannot exceed 500 characters' }),

    type: z.enum(['multiple_choice', 'multi_answer', 'true_false', 'matching', 'ordering'], {
        invalid_type_error: 'Question type must be one of: multiple_choice, multi_answer, true_false, matching, ordering',
        invalid_enum_value: 'Question type must be one of: multiple_choice, multi_answer, true_false, matching, ordering',
        required_error: 'Question type is required'
    }),

    category_id:z.union([
        z.string().uuid({ message: 'Invalid category ID format, must be a valid UUID' }),
        z.null()
    ]),

    difficulty: z.enum(['easy', 'medium', 'hard'], {
        invalid_type_error: 'Difficulty level must be one of: easy, medium, hard',
        required_error: 'Difficulty level is required'
    }),

    media_url: z.string()
        .url({ message: 'Invalid URL format. Must be a valid URL' }) // Ensures it's a URL
        .regex(validExtensions, { message: 'Invalid media file format. Allowed: jpeg, jpg, png, gif, mp4, mov, avi, webm' })
        .nullable(),

    is_competitive: z.boolean({
        invalid_type_error: 'is_competitive must be a boolean value'
    }),

    answers: z.array(z.object({})).min(2, { message: 'There must be at least 2 answers' })

});

export function validateQuestion(object){
    return questionSchema.safeParse(object)
}

export function validatePartialQuestion(object){
    return questionSchema.partial().safeParse(object)
}