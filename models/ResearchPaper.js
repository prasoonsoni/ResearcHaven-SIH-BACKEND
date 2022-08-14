const mongoose = require('mongoose')
const { Schema } = mongoose

const ResearchPaperSchema = new Schema({
    title: { type: String, required: true },
    authors: { type: Array, required: true },
    keywords: { type: Array, required: true },
    abstract: { type: String, required: true },
    introduction: { type: String, required: true },
    literature_survey: { type: String, required: true },
    proposed_work: { type: String, required: true },
    methodology: { type: String, required: true },
    experimental_evaluation: { type: String, required: true },
    conclusion: { type: String, required: true },
    references: { type: String, required: true },
    created_at: { type: Number, default: Date.now() },
    updated_at: { type: Number, default: Date.now() }
})

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema)