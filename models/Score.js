import mongoose from "mongoose"
const { Schema } = mongoose

const ScoreSchema = new Schema({
    proposal_cid: { type: mongoose.Schema.Types.ObjectId, required: true },
    expert_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    score1: { type: Number, required: true },
    score2: { type: Number, required: true },
    score3: { type: Number, required: true },
    comments: { type: String, required: true }
})

export default mongoose.model("Score", ScoreSchema)