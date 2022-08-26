import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectToDatabase from "./database/connection.js"
import userRouter from "./routes/userRoutes.js"
import researchProposalRouter from "./routes/researchProposalRoutes.js"
import plagiarismRouter from "./routes/plagiarismRoutes.js"
import fundingRouter from "./routes/fundingRoutes.js"
import expertRouter from "./routes/expertRoutes.js"

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
app.use('/api/proposal', researchProposalRouter)
app.use('/api/plagiarism', plagiarismRouter)
app.use('/api/funding', fundingRouter)
app.use('/api/expert', expertRouter)

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})
