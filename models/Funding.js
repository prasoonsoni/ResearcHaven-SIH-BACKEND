import mongoose from 'mongoose'
const { Schema } = mongoose

const FundingSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    research_proposal_id: { type: Schema.Types.ObjectId, ref: 'ResearchProposal' },
    amount: { type: Number, default: 0, required: true },
    duration: { type: String, default: '', required: true },
    organisation_name: { type: String, default: '' },
    approved_at: { type: Number, default: Date.now() },
})

export default mongoose.model('Funding', FundingSchema)