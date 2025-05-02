import Sequelize, { where } from "sequelize";
import { Op, fn, col, where as whereFn, literal } from 'sequelize';

import db from "../../../models/index.js";
import { InternalServerError } from "../errors/errors.js";

const Trivia = db.Trivia;
const User = db.User
const Category = db.Category
const Question = db.Question
const Choice = db.Choice
const QuestionOrdering = db.QuestionOrdering
const QuestionPair = db.QuestionPair
const TriviaQuestion = db.TriviaQuestion

export class TriviaService{

    static async getAll({filters}){
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
            page,
            limit
        } = filters

        const limitUsed = limit ?? 10
        const pageUsed = page ?? 1
        const offset = ((pageUsed - 1) * limitUsed)
        const pagination = {limit: limitUsed, offset}
        const where = {};
        const group = ['trivia.id']
        const having = {};
        const include = [
            { model: User, attributes: {exclude: ['passwordHash', 'created_at','updated_at']}, require:false },
            { model: Category, require:false },
            { model: TriviaQuestion, attributes: [], require: false }
        ];

        if(search){
            where.title = {
                [Op.like]: `%${search}%`
            }
        }

        if(difficulty){
            where.difficulty = difficulty
        }

        if(is_competitive !== undefined){
            where.is_competitive = is_competitive ? 1 : 0
        }

        if(category){
            include.push({
                model: Category,
                where: {
                    name: {
                        [Op.like]: `%${category}%`
                    }
                }
            })
        }
      
        if(creator_alias){
            include.push({
                model: User,
                where: {
                    alias: {
                        [Op.like]: `%${creator_alias}%`
                    }
                },
                require: true
            })
        }

        if(min_questions){
            having[Op.and] = having[Op.and] || []
            having[Op.and].push(
                whereFn(fn('COUNT', col('TriviaQuestions.question_id')), Op.gte, min_questions)
            )
        }

        if(max_questions){
            having[Op.and] = having[Op.and] || []
            having[Op.and].push(
                whereFn(fn('COUNT', col('TriviaQuestions.question_id')), Op.lte, max_questions)
            )
        }

        let order = []
        
        if(order_by) {
            const sortType = sort || 'asc'
            const orderMap = {
                'created_at': 'createdAt',
                'rating' : 'rating',
                'times_played' : 'play_count'
            }
            const orderByType = orderMap[order_by] || order_by
            order.push([orderByType, sortType.toUpperCase()])
        }

        const trivias = await Trivia.findAll({
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM trivia_questions AS tq
                            WHERE tq.trivia_id = trivia.id
                        )`), 
                        'question_quantity'
                    ]
                ],
                exclude: ['category_id', 'created_by']
            },
            where,
            include,
            group, 
            having,
            order,
            ...pagination
        })
        
        const totalCount = await Trivia.count({
            where,
            include: include.map(inc => ({
                ...inc,
                attributes: []
            })),
            distinct: true
        })

        const total = totalCount || 0
        const totalPages = Math.ceil(total/pagination.limit);

        return {
            trivias,
            total,
            totalPages,
            page : pageUsed,
            limit : limitUsed
        };
    }

    static async createTrivia({data}){
        const {
            title,
            description,
            category_id,
            difficulty,
            is_competitive,
            is_public,
            created_by,
            questions
        } = data;
    
        try {
            // Create the main trivia record
            const trivia = await Trivia.create(
                {title, description, category_id, difficulty, is_public, created_by, is_competitive},
                {fields: ['title', 'description', 'category_id', 'difficulty', 'is_public', 'created_by', 'is_competitive']}
            );
    
            const createdQuestionsWithAnswers = await this.addQuestionsToTrivia({trivia_id: trivia.id, questions})

            trivia.questions = createdQuestionsWithAnswers
            return trivia

        }catch(err){
            console.error("Error creating trivia", err)
            throw new Error('Error creating trivia')
        }
    }

    static async addQuestionsToTrivia({ trivia_id, questions }) {
        try {
            const createdQuestions = await Promise.all(questions.map(async (question) => {
                const {
                    text,
                    type,
                    category_id,
                    difficulty,
                    media_url,
                    is_competitive,
                    created_by,
                    answers
                } = question;
    
                // Crear la pregunta
                const questionCreated = await Question.create(
                    { text, type, category_id, difficulty, media_url, is_competitive, created_by },
                    { fields: ["text", "type", "category_id", "difficulty", "media_url", "is_competitive", "created_by"] }
                );
    
                const question_id = questionCreated.id;
    
                // Relacionar la pregunta con la trivia
                await TriviaQuestion.create(
                    { trivia_id, question_id },
                    { fields: ["trivia_id", "question_id"] }
                );
    
                // Procesar respuestas
                const answersCreated = await Promise.all(answers.map(async (answer) => {
                    const questionIdForAnswer = answer.question_id ?? question_id;
                    return await this.addAnswerToQuestion({ question_id: questionIdForAnswer, answer, type });
                }));
    
                questionCreated.answers = answersCreated;
                return questionCreated;
            }));
    
            return createdQuestions;
        } catch (err) {
            console.error("Error in addQuestionsToTrivia:", err);
            throw new Error("Error adding questions to trivia.");
        }
    }
    
    static async addAnswerToQuestion({ question_id, type, answer }) {
        try {
            switch (type) {
                case "multiple_choice":
                case "multi_answer":
                case "true_false":
                    return await Choice.create(
                        { question_id, text: answer.text, is_correct: answer.is_correct },
                        { fields: ["question_id", "text", "is_correct"] }
                    );
    
                case "ordering":
                    return await QuestionOrdering.create(
                        { question_id, text: answer.text, correct_position: answer.correct_position },
                        { fields: ["question_id", "text", "correct_position"] }
                    );
    
                case "matching":
                    return await QuestionPair.create(
                        { question_id, left_item: answer.left_item, right_item: answer.right_item },
                        { fields: ["question_id", "left_item", "right_item"] }
                    );
    
                default:
                    throw new Error(`Unsupported question type: ${type}. Allowed types: multiple_choice, multi_answer, true_false, ordering, matching`);
            }
        } catch (error) {
            console.error("Error creating answer:", error);
            throw new Error("Error creating answer in database.");
        }
    }
    
    static async getById({id}){
        try {
            const trivia = await Trivia.findByPk(id,{
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM trivia_questions AS tq
                                WHERE tq.trivia_id = trivia.id
                            )`), 
                            'question_quantity'
                        ]
                    ]
                },
                include: [
                    { model: User, attributes: {exclude: ['passwordHash', 'created_at','updated_at']} },
                    { model: Category },
                    { model: Question,
                        include: [
                            { model: Choice },
                            { model: QuestionOrdering },
                            { model: QuestionPair }
                        ]
                    }]
                })
            return trivia            
        } catch (err) {
            console.error(err)
            throw new Error('Error in db loading the trivia');
        }
    }

    static async triviaExists({id}){
        const trivia = await Trivia.findByPk(id, {attributes: ['id', 'created_by']})
        return trivia ?? false
    }

    static async questionExists({questionId, triviaId}){
        
        try {
            const question = await Question.findByPk(questionId, {attributes: ['id','type']})
        
            if(!question) return null
            
            const trivia = await Trivia.findOne({
                attributes: ['id'],
                include: {
                    model: TriviaQuestion, 
                    where: {question_id: questionId}
                },
            })
            return triviaId === trivia.id ? question : false
        } catch (error) {
            console.log(error)
            throw new InternalServerError('Error in DB while validating if question exists.')
        }
    }

    static async getTriviaQuestionsByCategoryId({category_id, filters}){ 
        const {difficulty, limit} = filters

        const where = {}

        where.category_id = category_id
        if(difficulty) where.difficulty = difficulty

        try {
            const questions = await Question.findAll({
                attributes: { },
                include: [
                    { model: Choice, attributes: {exclude: ['is_correct']}},
                    { model: QuestionOrdering, attributes: {exclude: ['correct_position']}},
                    { model: QuestionPair, attributes: {exclude: ['right_item']}}
                ],
                where,
                limit 
            })
            return questions
        } catch (err) {
            console.error(err)
            throw new Error("Error in the DB loading the questions");
        }
    }

    static async getQuestionsByTriviaId({id}){
        try {
            const questions = await Trivia.findByPk(id, {
                attributes: [],
                include: [{
                  model: Question,
                  include: [
                    { model: Choice },
                    { model: QuestionOrdering },
                    { model: QuestionPair }
                  ]
                }]
              });

            return questions            
        } catch (err) {
            console.error(err)
            throw new Error('Error in db loading the trivia questions');
        }
    }

    static async updateTrivia({data}){
        const {
            id,
            title,
            description,
            category_id,
            is_competitive,
            difficulty,
            is_public
        } = data

        console.log({data})

        try {
            
            const updatedTrivia = await Trivia.update(
                {title, description, category_id, is_competitive, difficulty, is_public},
                {where: {id}}
            )
            console.log({updatedTrivia})
            return updatedTrivia

        } catch (err) {
            console.log(err)
            throw new Error('Error updating trivia')
        }
    }

    static async updateQuestionsAnswers({questions}){
        try {
            const updatedQuestions = await Promise.all(questions.map(async (question) => {
                const {
                    id,
                    text,
                    type,
                    category_id,
                    difficulty,
                    media_url,
                    is_competitive,
                    answers,
                    previusType,
                } = question;

                await Question.update(
                    {text, type, category_id, difficulty, media_url, is_competitive},
                    {where: {id}}
                )
                
                await this.deleteAnswers({questionId: id, type: previusType??type})

                await Promise.all(answers.map(async(answer) => {
                    return this.addAnswerToQuestion({question_id: id, type, answer}) 
                }))
            }))

            // console.log({updatedQuestions})

            return updatedQuestions
            
        } catch (error) {
            console.error("Error updating questions and answers:", error);
            throw new InternalServerError("Failed to update questions and answers.");
        }
    }

    // static async updateAnswer({ type, answer }) {
    //     try {
    //         switch (type) {
    //             case "multiple_choice":
    //             case "multi_answer":
    //             case "true_false":
    //                 return await Choice.update(
    //                     { text: answer.text, is_correct: answer.is_correct },
    //                     { where: {id: answer.id} }
    //                 );
    
    //             case "ordering":
    //                 return await QuestionOrdering.update(
    //                     { text: answer.text, correct_position: answer.correct_position },
    //                     { where: {id: answer.id} }
    //                 );
    
    //             case "matching":
    //                 return await QuestionPair.update(
    //                     { left_item: answer.left_item, right_item: answer.right_item },
    //                     { where: {id: answer.id} }
    //                 );
    
    //             default:
    //                 throw new Error(`Unsupported question type: ${type}. Allowed types: multiple_choice, multi_answer, true_false, ordering, matching`);
    //         }
    //     } catch (error) {
    //         console.error("Error creating answer:", error);
    //         throw new Error("Error creating answer in database.");
    //     }
    // }

    static async deleteAnswers({questionId, type}){
        console.log({delete: "en deleete",questionId, type})
        try {
            switch (type) {
                case "multiple_choice":
                case "multi_answer":
                case "true_false":
                    return await Choice.destroy({
                        where: { question_id: questionId }
                    })
    
                case "ordering":
                    return await QuestionOrdering.destroy({
                        where: { question_id: questionId }
                    })
    
                case "matching":
                    return await QuestionPair.destroy({
                        where: { question_id: questionId }
                    })
    
                default:
                    throw new Error(`Answer dont deleted because not found`);
            }

        } catch (error) {
            console.log(error)
            throw new InternalServerError("Failed to deleting answers from database.")
        }
    }

    static async publishTrivia({triviaId}){
        try {
            const updatedTrivia = await Trivia.update(
                {is_public: true},
                {where: {id: triviaId}}
            )
            return updatedTrivia

        } catch (err) {
            console.log(err)
            throw new Error('Error publishing trivia')
        }
    }

}


// TODO: delete trivia by id

// TODO: duplicate trivia

// TODO: publish trivia


