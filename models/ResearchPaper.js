const mongoose = require('mongoose')
const { Schema } = mongoose

const ResearchPaperSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    cid: { type: String, required: true, default: '' },
    title: { type: String, required: true, default: '' },
    authors: { type: Array, required: true, default: [] },
    keywords: { type: Array, required: true, default: [] },
    abstract: { type: String, required: true, default: '' },
    introduction: { type: String, required: true, default: '' },
    literature_survey: { type: String, required: true, default: '' },
    proposed_work: { type: String, required: true, default: '' },
    methodology: { type: String, required: true, default: '' },
    experimental_evaluation: { type: String, required: true, default: '' },
    conclusion: { type: String, required: true, default: '' },
    references: { type: String, required: true, default: '' },
    created_at: { type: Number, default: Date.now() },
    updated_at: { type: Number, default: Date.now() }
})

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema)