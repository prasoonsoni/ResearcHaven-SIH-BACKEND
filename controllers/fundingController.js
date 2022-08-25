import Funding from '../models/Funding.js'
import ResearchProposal from '../models/ResearchProposal.js'
import User from '../models/User.js'
import { ObjectId } from 'mongodb'

const giveFunding = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const { amount, duration, organisation_name } = req.body
        const research_proposal = await ResearchProposal.findOne({ cid: research_proposal_cid })
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (!research_proposal.submitted) {
            return res.json({ success: false, message: 'Research Proposal Not Submitted.' })
        }
        if(research_proposal.funded) {
            return res.json({ success: false, message: 'Research Proposal Already Funded.' })
        }
        const user_id = new ObjectId(research_proposal.user_id)
        const user = await User.findOne({ _id: user_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const createFunding = await Funding.create({
            user_id: user_id,
            research_proposal_id: research_proposal._id,
            amount: amount,
            duration: duration,
            organisation_name: organisation_name,
            approved_at: Date.now()
        })
        if (!createFunding) {
            return res.json({ success: false, message: 'Funding Not Created.' })
        }
        const updateProposal = await ResearchProposal.updateOne({ _id: research_proposal._id }, { $set: { funded: true } })
        if (!updateProposal.acknowledged) {
            return res.json({ success: false, message: 'Funding Not Created.' })
        }
        const updateUser = await User.updateOne({ _id: user._id }, { $pull: { submitted_research_proposals: research_proposal_cid }, $push: { funded_research_proposals: research_proposal_cid } })
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Funding Not Created.' })
        }
        return res.json({ success: true, message: 'Funding Created Successfully.' })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

export default {
    giveFunding
}