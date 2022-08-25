import mongoose from 'mongoose'
const { Schema } = mongoose

const PlagiarismReportSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    research_proposal_id: { type: Schema.Types.ObjectId, ref: 'ResearchProposal' },
    level: { type: Number, default: 0, required: true },
    report: { type: Array, required: true },
})

export default mongoose.model('PlagiarismReport', PlagiarismReportSchema)