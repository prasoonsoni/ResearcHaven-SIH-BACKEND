require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connectToDatabase = require('./database/connection')
const port = 3000 || process.env.PORT
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectToDatabase()

app.get('/', (req, res) => {
    res.send('Welcome to SIH Backend API.')
})

app.use('/api/user', require('./routes/userRoutes'))
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
