import mongoose from 'mongoose'
const { Schema } = mongoose

const RejectedProposalsSchema = new Schema({
    data: { type: Object, required: true },
    reason: { type: String, required: true },
    rejected_at: { type: Number, default: Date.now() }
})

export default mongoose.model('RejectedProposals', RejectedProposalsSchema)