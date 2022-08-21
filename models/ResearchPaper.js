const mongoose = require('mongoose')

const { Schema } = mongoose

const ResearchPaperSchema = new Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	cid: { type: String, default: '' },
	title: { type: String, default: '' },
	authors: { type: String, default: '' },
	keywords: { type: String, default: '' },
	abstract: { type: String, default: '' },
	introduction: { type: String, default: '' },
	literature_survey: { type: String, default: '' },
	proposed_work: { type: String, default: '' },
	methodology: { type: String, default: '' },
	experimental_evaluation: { type: String, default: '' },
	conclusion: { type: String, default: '' },
	references: { type: String, default: '' },
	published: { type: Boolean, default: false },
	created_at: { type: Number, default: Date.now() },
	updated_at: { type: Number, default: Date.now() }
})

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema)
