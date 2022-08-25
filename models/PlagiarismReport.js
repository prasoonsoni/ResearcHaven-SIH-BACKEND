import mongoose from 'mongoose'
const { Schema } = mongoose

const PlagiarismReportSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    research_paper_id: { type: Schema.Types.ObjectId, ref: 'ResearchPaper' },
    level: { type: Number, default: 0, required: true },
    report: { type: Array, required: true },
})

export default mongoose.model('PlagiarismReport', PlagiarismReportSchema)