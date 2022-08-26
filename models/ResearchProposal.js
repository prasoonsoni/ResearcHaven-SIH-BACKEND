import mongoose from "mongoose"
const { Schema } = mongoose

const ResearchProposalSchema = new Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	cid: { type: String, default: '' },
	title: { type: String, default: '' },
	researchers: { type: String, default: '' },
	keywords: { type: String, default: '' },
	introduction: { type: String, default: '' },
	problem_statement_and_objectives: { type: String, default: '' },
	literature_review: { type: String, default: '' },
	methodology: { type: String, default: '' },
	bibliography: { type: String, default: '' },
	submitted: { type: Boolean, default: false },
	verified: { type: Boolean, default: false },
	funded: { type: Boolean, default: false },
	funding_amount: { type: String, default: '' },
	created_at: { type: Number, default: Date.now() },
	updated_at: { type: Number, default: Date.now() }
})

export default mongoose.model('ResearchProposal', ResearchProposalSchema)
