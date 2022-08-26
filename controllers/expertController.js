import Funding from '../models/Funding.js'
import ResearchProposal from '../models/ResearchProposal.js'
import RejectedProposals from '../models/RejectedProposals.js'
import User from '../models/User.js'
import Score from '../models/Score.js'
import Expert from '../models/Expert.js'

const verifyProposal = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const {score1, score2, score3, comments} = req.body

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getAllProposals = async (req, res) => {
    try {
        const expert_id = new ObjectId(req.user._id)
        const expert = await Expert.findOne({ _id: expert_id })
        if (!expert) {
            return res.json({ success: false, message: 'Expert Not Found.' })
        }
        const proposals = await ResearchProposal.find({ expert_id: expert_id })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}