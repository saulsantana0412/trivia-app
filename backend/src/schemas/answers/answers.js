import { validateChoice } from "./choices.schema.js";
import { validatePairsAnswer } from "./pairs_answer.schema.js";
import { validateOrderingAnswer } from "./ordering_answer.schema.js";

export function validateAnswers(question) {
    const { type, answers } = question;

    if(!type){
        return { success: false, error: 'Question type is required' };
    }

    if (!Array.isArray(answers) || answers.length === 0) {
        return { success: false, error: new Error('Answers array is required') };
    }

    const correctCount = answers.filter(a => a.is_correct).length;

    if (['multiple_choice', 'multi_answer', 'true_false'].includes(type)) {
        if (correctCount === 0) {
            return { success: false, error: 'At least one correct answer is required' };
        }

        if(type === 'multiple_choice' && correctCount > 1){
            return { success: false, error: 'multiple_choice must have exactly 1 correct answers, so change the type to multi_answer' };
        }

        if (type === 'true_false' && answers.length !== 2) {
            return { success: false, error: 'True/false questions must have exactly 2 answers' };
        }

        if (type === 'true_false' && correctCount>1) {
            return { success: false, error: 'True/false questions must have exactly 1 correct answers' };
        }
    }

    if (type == 'ordering'){

        const answersOrder = answers.map(a => a.correct_position);
        const hasDuplicates = new Set(answersOrder).size !== answersOrder.length;
    
        if (hasDuplicates) {
            return { success: false, error: 'Two or more answers should not have the same correct position' };
        }
    
        // Sort answers based on their order values
        const sortedOrders = [...answers].sort((a, b) => a.correct_position - b.correct_position);
    
        // Update each answer with its new sorted position
        answers.forEach(answer => {
            answer.correct_position = sortedOrders.findIndex(sorted => sorted.correct_position === answer.correct_position) + 1;
        });
    }

    const validateByType = (answer) => {
        switch (type) {
            case 'multiple_choice':
            case 'multi_answer':
            case 'true_false':
                return validateChoice(answer);
            case 'matching':
                return validatePairsAnswer(answer);
            case 'ordering': {            
                return validateOrderingAnswer(answer);
            }
            default:
                return { success: false, error: 'Invalid question type' };
        }
    };

    const validatedAnswers = answers.map(answer => {
        answer.question_id = answer.question_id ?? null
        return validateByType(answer)
    });

    const errorMessages = validatedAnswers
    .filter(r => !r.success) // Filtra solo los errores
    .flatMap(r => r.error.errors.map(e => e.message));


    if (errorMessages.length > 0) {
        return { success: false, error: errorMessages };
    }

    return {
        success: true,
        answers: validatedAnswers.map(a => a.data)
    };
}
