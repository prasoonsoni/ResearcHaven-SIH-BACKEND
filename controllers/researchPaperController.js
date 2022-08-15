const { ObjectId } = require('mongodb')
const ResearchPaper = require('../models/ResearchPaper')
const User = require('../models/User')

const createResearchPaper = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const { title, authors, keywords, abstract, introduction, literature_survey, proposed_work, methodology, experimental_evaluation, conclusion, references } = req.body
        const researchPaper = await ResearchPaper.create({ user_id, title, authors, keywords, abstract, introduction, literature_survey, proposed_work, methodology, experimental_evaluation, conclusion, references, })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Error Creating Research Paper.', })
        }
        const updateUser = await User.updateOne({ _id: user_id }, { $push: { research_papers: researchPaper._id } })
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating User.', })
        }
        return res.json({ success: true, message: 'Research Paper Created Successfully.', })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.', })
    }
}

module.exports = { createResearchPaper }
