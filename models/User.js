import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	whatsapp_number: { type: String, required: true },
	password: { type: String, required: true },
	research_proposals: { type: Array, required: true },
	submitted_research_proposals: { type: Array, required: true },
	funded_research_proposals: { type: Array, required: true },
	verified: { type: Boolean, required: true, default: false },
	type: { type: String, required: true, default: 'user' },
	created_at: { type: Number, default: Date.now() },
	updated_at: { type: Number, default: Date.now() }
})

export default mongoose.model('User', UserSchema)
