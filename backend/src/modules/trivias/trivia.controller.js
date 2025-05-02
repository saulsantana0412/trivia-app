import { TriviaService } from "./trivia.service.js";
import { validatePartialTrivia, validateTrivia } from "../../schemas/trivia.shema.js";
import { validateIdFormat } from "../../schemas/id_format.schema.js";
import { validatePartialQuestion, validateQuestion } from "../../schemas/question.schema.js";
import { validateAnswers } from "../../schemas/answers/answers.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateFilters } from "../../schemas/filters.shema.js";
import { BadRequestError, NotFoundError, UnauthorizedError, UnprocessableEntityError } from "../errors/errors.js";

const validateQuestionsWithAnswers = ({ questions, userId, partial }) => {
    const questionErrors = [];
    const validQuestions = [];

    questions.forEach((question, index) => {
        // Validate question
        const questionResult = partial
            ? validatePartialQuestion(question)
            : validateQuestion(question)

        if (!questionResult.success) {
            questionErrors.push({
                type: 'question',
                questionIndex: index,
                error: questionResult.error.errors[0].message
            });
            return;
        }

        // Validate answers
        const answerResult = validateAnswers(question);

        if (!answerResult.success) {
            questionErrors.push({
                type: 'answer',
                questionIndex: index,
                error: answerResult.error
            });
            return;
        }
        

        // Add validated question to collection
        validQuestions.push({
            ...questionResult.data,
            created_by: userId,
            answers: answerResult.answers
        });
    });

    return {
        success: questionErrors.length === 0,
        validQuestions,
        errors: questionErrors
    };
};

const validateTriviaById = async ({ triviaId }) => {
    if (!triviaId) {
        throw new BadRequestError('Trivia ID is required.');
    }

    const validTriviaId = validateIdFormat({ id: triviaId });

    if (!validTriviaId.success) {
        throw new UnprocessableEntityError({ errors: validTriviaId.error.errors });
    }

    const trivia = await TriviaService.triviaExists({ id: triviaId });
    if (!trivia) {
        throw new NotFoundError(`Trivia with ID ${triviaId} not found.`);
    }

    return trivia
}

const validateTriviaByIdAndAccess = async ({ triviaId, userId }) => {
    const trivia = await validateTriviaById({ triviaId })

    if (trivia.created_by !== userId) {
        throw new UnauthorizedError('Only the creator of this trivia can modify it.');
    }

    return trivia
}


export class TriviaController {

    static getAllTrivias = asyncHandler(async (req, res) => {
        const {
            category,
            difficulty,
            search,
            is_competitive,
            min_questions,
            max_questions,
            creator_alias,
            order_by,
            sort,
            limit,
            page
        } = req.query

        const filters = {
            category,
            difficulty,
            search,
            is_competitive,
            min_questions,
            max_questions,
            creator_alias,
            order_by,
            sort,
            limit,
            page
        }

        const validFilters = validateFilters(filters)

        const trivias = await TriviaService.getAll({ filters: validFilters })
        if (!trivias) return BadRequestError('Error Loading Trivias.')
        return successResponse(res, trivias)
    })

    static getTriviaById = asyncHandler(async (req, res) => {
        const { trivia_id: triviaId } = req.params
        const validTriviaId = validateIdFormat({ id: triviaId });
        if (!validTriviaId.success) {
            throw new UnprocessableEntityError(validTriviaId.error.errors[0].message);
        }
        const trivia = await TriviaService.getById({ id: validTriviaId.data.id })
        if (!trivia) throw new NotFoundError(`Trivia with ID ${validTriviaId.data.id} not found.`)
        return successResponse(res, { trivia })
    })

    static getTopTrivias = asyncHandler(async (req, res) => {
        // TODO create the popular trivia algorithm 
        return errorResponse(res, "TODO")
    })

    static getTriviaQuestionsByCategoryId = asyncHandler(async (req, res) => {
        const { difficulty, limit } = req.query
        const { category_id } = req.params
        const filters = { difficulty, limit }

        const validFilters = validateFilters(filters)
        // TODO validate if category exists 
        const questions = await TriviaService.getTriviaQuestionsByCategoryId({ category_id, filters: validFilters })
        if (!questions) throw new BadRequestError('Error loading Questions.')
        return successResponse(res, { questions })
    })

    static getQuestionsByTriviaId = asyncHandler(async (req, res) => {
        const { trivia_id } = req.params
        await validateTriviaById({ triviaId: trivia_id })

        const questions = await TriviaService.getQuestionsByTriviaId({ id: trivia_id })
        if (!questions) return errorResponse(res, 'Questions not found')

        return successResponse(res, questions)
    })

    static createTrivia = asyncHandler(async (req, res) => {
        const data = req.body
        const user = req.user
        data.created_by = user.id

        const questions = data.questions

        const validTrivia = validateTrivia(data)

        if (!validTrivia.success) {
            const errorMessages = validTrivia.error.errors.map(e => e.message)
            throw new UnprocessableEntityError({ message: 'Invalid trivia format', errors: errorMessages });
        }

        const validQuestionsWithAnswers = validateQuestionsWithAnswers({ questions, userId: user.id });
        if (!validQuestionsWithAnswers.success) {
            throw new UnprocessableEntityError({ message: 'Invalid questions/answers format', errors: validQuestionsWithAnswers.errors });
        }

        const fullTrivia = {
            ...validTrivia.data,
            questions: validQuestionsWithAnswers.validQuestions
        }

        const createdTrivia = await TriviaService.createTrivia({ data: fullTrivia })
        if (!createdTrivia) throw new BadRequestError('Error creating trivia.')
        return successResponse(res, { trivia: createdTrivia, questions: createdTrivia.questions }, 201)
    })

    static addQuestionToTrivia = asyncHandler(async (req, res) => {
        const { questions } = req.body;
        const { trivia_id } = req.params
        const userId = req.user.id;

        await validateTriviaByIdAndAccess({ triviaId: trivia_id, userId })

        const validQuestionsWithAnswers = validateQuestionsWithAnswers({ questions, userId });
        if (!validQuestionsWithAnswers.success) {
            throw new UnprocessableEntityError({ errors: validQuestionsWithAnswers.errors });
        }

        const createdQuestionsWithAnswers = await TriviaService.addQuestionsToTrivia({
            trivia_id,
            questions: validQuestionsWithAnswers.validQuestions
        });

        if (!createdQuestionsWithAnswers) return errorResponse(res, 'Error creating adding the questions')
        return successResponse(res, { questions: createdQuestionsWithAnswers });
    })

    static updateTrivia = asyncHandler(async (req, res) => {
        const data = req.body
        const userId = req.user.id
        const { trivia_id } = req.params

        await validateTriviaByIdAndAccess({ triviaId: trivia_id, userId })

        data.id = trivia_id
        const validTrivia = validatePartialTrivia(data)

        if (!validTrivia.success) return errorResponse(res, validTrivia.error)

        const updatedTrivia = TriviaService.updateTrivia({ data: validTrivia.data })

        if (!updatedTrivia || updatedTrivia.length == 0) return errorResponse(res, `Cannot update trivia with id: ${triviaId}`)

        return successResponse(res)

    })

    static updateTriviaQuestions = asyncHandler(async (req, res) => {
        const data = req.body
        const userId = req.user.id
        const { trivia_id: triviaId } = req.params
        const questions = data.questions

        await validateTriviaByIdAndAccess({ triviaId, userId })

        const questionsErrors = []

        const validQuestionsWithAnswers = validateQuestionsWithAnswers({ questions, partial: true })

        if (!validQuestionsWithAnswers.success) {
            throw new UnprocessableEntityError({ message: 'Invalid questions/answers format', errors: validQuestionsWithAnswers.errors });
        }

        const questionsToUpdate = await Promise.all(validQuestionsWithAnswers.validQuestions.map(async (question, index) => {

            if (question.id === null) {
                questionsErrors.push({
                    index,
                    message: `Question ID is required`
                })
                return
            }
            const validQuestion = await TriviaService.questionExists({ questionId: question.id, triviaId })

            if (validQuestion === null) {
                questionsErrors.push({
                    index,
                    message: `Question with id: ${question.id} not exists`
                })
                return
            }

            if (!validQuestion) {
                questionsErrors.push({
                    index,
                    message: `Question with id: ${question.id} does not belong trivia with id: ${triviaId}`
                })
                return
            }

            validQuestion.type = validQuestion.type ?? question.type 
            
            if (validQuestion.type !== question.type) {
                question.previusType = validQuestion.type
            }
            
            return question
        }))

        if (questionsErrors.length > 0) {
            throw new UnprocessableEntityError({ errors: questionsErrors })
        }

        if (questionsToUpdate.length === 0) {
            throw new BadRequestError("No questions to update")
        }

        const updatedQuestions = await TriviaService.updateQuestionsAnswers({ questions: questionsToUpdate })
        if (!updatedQuestions) throw new BadRequestError()
        return successResponse(res)
    })

    static publishTrivia = asyncHandler(async (req, res) => {
        const userId = req.user.id
        const { trivia_id: triviaId } = req.params

        const trivia = await validateTriviaByIdAndAccess({ triviaId, userId })
        

    }) 

    static async deleteTrivia(req, res, next) {
    }

    static async removeQuestionFromTrivia(req, res, next) {
    }


}