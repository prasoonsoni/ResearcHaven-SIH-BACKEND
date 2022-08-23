import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()
const { MONGO_URI } = process.env

const connectToDatabase = () => {
	try {
		mongoose.connect(
			MONGO_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				keepAlive: true
			},
			() => {
				console.log('Mongoose is Connected.')
			}
		)
	} catch (err) {
		console.log(`Could not connect: ${err}`)
	}
	const dbConnection = mongoose.connection

	dbConnection.on('error', (err) => {
		console.log(`Connection Error: ${err}`)
	})

	dbConnection.once('open', () => {
		console.log('Connected to DB!')
	})
}

export default connectToDatabase
