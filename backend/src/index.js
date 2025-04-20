import express from 'express'
import cors from 'cors'

import { UserRouter } from './modules/users/user.routes.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/v1/users', UserRouter)

app.use((err, req, res, next) => {
  console.log("Central Error Manager: ",err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  })

})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`))
