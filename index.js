import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectToDatabase from "./database/connection.js"
import userRouter from "./routes/userRoutes.js"
import researchPaperRouter from "./routes/researchPaperRoutes.js"
import plagiarismRouter from "./routes/plagiarismRoutes.js"

const app = express()
dotenv.config()
const port = 3000 || process.env.PORT
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectToDatabase()

app.get('/', (req, res) => {
	res.send('Welcome to SIH Backend API.')
})

app.use('/api/user', userRouter)
app.use('/api/researchpaper', researchPaperRouter)
app.use('/api/plagiarism', plagiarismRouter)

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})
