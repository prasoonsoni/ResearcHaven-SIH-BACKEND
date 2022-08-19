const { ObjectId } = require('mongodb')
const ResearchPaper = require('../models/ResearchPaper')
const User = require('../models/User')

const createResearchPaper = async (req, res) => {
	try {
		const user_id = new ObjectId(req.user._id)
		if (!user_id) {
			return res.json({ success: false, message: 'User Not Found.' })
		}
		const {
			title,
			authors,
			keywords,
			abstract,
			introduction,
			literature_survey,
			proposed_work,
			methodology,
			experimental_evaluation,
			conclusion,
			references
		} = req.body
		const researchPaper = await ResearchPaper.create({
			user_id,
			title,
			authors,
			keywords,
			abstract,
			introduction,
			literature_survey,
			proposed_work,
			methodology,
			experimental_evaluation,
			conclusion,
			references
		})
		if (!researchPaper) {
			return res.json({ success: false, message: 'Error Creating Research Paper.' })
		}
		const updateUser = await User.updateOne(
			{ _id: user_id },
			{ $push: { research_papers: researchPaper._id } }
		)
		if (!updateUser.acknowledged) {
			return res.json({ success: false, message: 'Error Updating User.' })
		}
		return res.json({ success: true, message: 'Research Paper Created Successfully.' })
	} catch (error) {
		console.log(error.message)
		res.json({ success: false, message: 'Some Internal Server Error Occured.' })
	}
}

const editResearchPaper = async (req, res) => {
	try {
		const user_id = new ObjectId(req.user._id)
		const research_paper_id = new ObjectId(req.params.id)
		if (!user_id || !research_paper_id) {
			return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
		}
		if (!user_id) {
			return res.json({ success: false, message: 'User Not Found.' })
		}
		const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
		if (!researchPaper) {
			return res.json({ success: false, message: 'Research Paper Not Found.' })
		}
		if (researchPaper.user_id.toString() !== user_id.toString()) {
			return res.json({
				success: false,
				message: 'You Do Not Have Permission To Edit This Research Paper.'
			})
		}
		const {
			title,
			authors,
			keywords,
			abstract,
			introduction,
			literature_survey,
			proposed_work,
			methodology,
			experimental_evaluation,
			conclusion,
			references
		} = req.body
		const updateResearchPaper = await ResearchPaper.updateOne(
			{ _id: research_paper_id },
			{
				$set: {
					title,
					authors,
					keywords,
					abstract,
					introduction,
					literature_survey,
					proposed_work,
					methodology,
					experimental_evaluation,
					conclusion,
					references,
					updated_at: Date.now()
				}
			}
		)
		if (!updateResearchPaper.acknowledged) {
			return res.json({ success: false, message: 'Error Updating Research Paper.' })
		}
		return res.json({ success: true, message: 'Research Paper Updated Successfully.' })
	} catch (error) {
		console.log(error.message)
		res.json({ success: false, message: 'Some Internal Server Error Occured.' })
	}
}

const deleteResearchPaper = async (req, res) => {
	try {
		const user_id = new ObjectId(req.user._id)
		const research_paper_id = new ObjectId(req.params.id)
		if (!user_id || !research_paper_id) {
			return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
		}
		if (!user_id) {
			return res.json({ success: false, message: 'User Not Found.' })
		}
		const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
		if (!researchPaper) {
			return res.json({ success: false, message: 'Research Paper Not Found.' })
		}
		if (researchPaper.user_id.toString() !== user_id.toString()) {
			return res.json({
				success: false,
				message: 'You Do Not Have Permission To Delete This Research Paper.'
			})
		}
		const deleteResearchPaper = await ResearchPaper.deleteOne({ _id: research_paper_id })
		if (!deleteResearchPaper.acknowledged) {
			return res.json({ success: false, message: 'Error Deleting Research Paper.' })
		}
		const updateUser = await User.updateOne(
			{ _id: user_id },
			{ $pull: { research_papers: research_paper_id } }
		)
		if (!updateUser.acknowledged) {
			return res.json({ success: false, message: 'Error Updating User.' })
		}
		return res.json({ success: true, message: 'Research Paper Deleted Successfully.' })
	} catch (error) {
		console.log(error.message)
		res.json({ success: false, message: 'Some Internal Server Error Occured.' })
	}
}

const getAllPublishedResearchPapers = async (req, res) => {
	try {
		const researchPapers = await ResearchPaper.find({ published: true })
		if (!researchPapers) {
			return res.json({ success: false, message: 'No Published Research Papers Found.' })
		}
		return res.json({ success: true, message: 'Published Research Papers Found.', researchPapers })
	} catch (error) {
		console.log(error.message)
		res.json({ success: false, message: 'Some Internal Server Error Occured.' })
	}
}

const getAllPublishedResearchPapersByUser = async (req, res) => {
	try {
		const user_id = new ObjectId(req.user._id)
		if (!user_id) {
			return res.json({ success: false, message: 'User Not Found.' })
		}
		const researchPapers = await ResearchPaper.find({ user_id, published: true })
		if (!researchPapers) {
			return res.json({ success: false, message: 'No Published Research Papers Found.' })
		}
		return res.json({ success: true, message: 'Published Research Papers Found.', researchPapers })
	} catch (error) {
		console.log(error.message)
		res.json({ success: false, message: 'Some Internal Server Error Occured.' })
	}
}
module.exports = {
	createResearchPaper,
	editResearchPaper,
	deleteResearchPaper,
	getAllPublishedResearchPapers,
	getAllPublishedResearchPapersByUser
}
