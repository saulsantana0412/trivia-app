import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { PORT } from './config/config.js';

import { userRouter } from './modules/users/user.routes.js'
import { authRouter } from './modules/auth/auth.routes.js';
import { triviaRouter } from './modules/trivias/trivia.routes.js';
import { errorResponse } from './utils/response.js';

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/trivias', triviaRouter)

app.use((err, req, res, next) => {
    // console.error(err);
    console.error({
        message: err.message,
        statusCode: err.statusCode || 500,
        stack: err.stack.split("\n").slice(0, 5)
    });
    errorResponse(res, err.message, err.errors, err.statusCode)
})

app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`))
