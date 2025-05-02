import { Router } from "express";
import { TriviaController } from "./trivia.controller.js";
import {authMiddleware} from "../../middlewares/auth.middleware.js"

export const triviaRouter = Router()

// All Trivias
triviaRouter.get('/', TriviaController.getAllTrivias) 
// Popular Trivias
triviaRouter.get('/popular', TriviaController.getTopTrivias) // TODO: Popular search algotithm
// Get Trivias Questions
triviaRouter.get('/questions/:category_id', TriviaController.getTriviaQuestionsByCategoryId)
// Trivias by Id
triviaRouter.get('/:trivia_id', TriviaController.getTriviaById) 
// Get Trivias Questions by Trivia id
triviaRouter.get('/:trivia_id/questions', TriviaController.getQuestionsByTriviaId)  

// Create trivia
triviaRouter.post('/', authMiddleware, TriviaController.createTrivia)
// Add Question(s)
triviaRouter.post('/:trivia_id/questions/', authMiddleware, TriviaController.addQuestionToTrivia) 

// Update trivia
triviaRouter.patch('/:trivia_id', authMiddleware, TriviaController.updateTrivia)
// Update question
triviaRouter.patch('/:trivia_id/questions/', authMiddleware, TriviaController.updateTriviaQuestions)

// Delete trivia
triviaRouter.delete('/:trivia_id', authMiddleware, TriviaController.deleteTrivia)
// Delete question
triviaRouter.delete('/:trivia_id/questions/:question_id', authMiddleware, TriviaController.removeQuestionFromTrivia)
