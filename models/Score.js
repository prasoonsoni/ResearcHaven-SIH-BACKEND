import mongoose from "mongoose"
const { Schema } = mongoose

const ScoreSchema = new Schema({
    proposal_cid: { type: String, required: true },
    expert_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    score1: { type: String, required: true },
    score2: { type: String, required: true },
    score3: { type: String, required: true },
    comments: { type: String, required: true },
    verified_at: { type: Number, default: Date.now() }
})

export default mongoose.model("Score", ScoreSchema)