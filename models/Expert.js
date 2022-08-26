import mongoose from "mongoose"
const { Schema } = mongoose

const ExpertSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    proposals: { type: Array, required: true },
})

export default mongoose.model("Expert", ExpertSchema)