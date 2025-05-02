import z from 'zod'

const filtersSchema = z.object({
    category: z.string().optional(), 
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(), 
    search: z.string().optional(), 
    is_competitive: z.preprocess((val) => {
        if (val === "true" || val === true) return true;
        if (val === "false" || val === false) return false;
        return undefined; // Si viene un valor inesperado, lo ignora
    }, z.boolean().optional()), 
    min_questions: z.coerce.number().int().min(1).optional(), 
    max_questions: z.coerce.number().int().min(1).optional(), 
    creator_alias: z.string().optional(),
    order_by: z.enum(['created_at', 'rating', 'times_played']).optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional(),
    page: z.coerce.number().int().min(1).optional()
}).superRefine((data, ctx) => {
    if (data.min_questions && data.max_questions && data.min_questions > data.max_questions) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "min_questions cannot be greater than max_questions",
            path: ["min_questions"]
        });
    }
});

export function validateFilters(object){
    const resultFilters = filtersSchema.safeParse(object)
    const validFilters = resultFilters.success 
        ? Object.fromEntries(
            Object.entries(resultFilters.data)
                .filter(([_, value])=>value!==undefined)
        )   
        : {}
    return validFilters
}