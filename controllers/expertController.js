import Funding from '../models/Funding.js'
import ResearchProposal from '../models/ResearchProposal.js'
import RejectedProposals from '../models/RejectedProposals.js'
import User from '../models/User.js'
import Score from '../models/Score.js'
import Expert from '../models/Expert.js'
import { ObjectId } from 'mongodb'
const verifyProposal = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const { score1, score2, score3, comments } = req.body

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
        const expert = await Expert.findOne({ user_id: expert_id })
        if (!expert) {
            return res.json({ success: false, message: 'Expert Not Found.' })
        }
        const proposals = expert.proposals
        if (proposals.length === 0) {
            return res.json({ success: false, message: 'No Proposals Found.' })
        }
        const allProposals = []
        for (let i = 0; i < proposals.length; i++) {
            const proposal = await ResearchProposal.findOne({ cid: proposals[i] })
            if (!proposal) {
                return res.json({ success: false, message: 'Research Proposal Not Found.' })
            }
            allProposals.push(proposal)
        }
        return res.json({ success: true, message: 'Proposals Found Successfully.', data: allProposals })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

export default {
    getAllProposals
}