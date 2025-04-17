import express from 'express'
import cors from 'cors'

import {pool} from './config/db.js'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.send({ status: 'OK' })
})

app.get('/categories', async (req, res, next) => {

  try {
    const [rows] = await pool.query('SELECT * FROM categories')
    res.json(rows)
  } catch (err) {
    next(err)
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`))
