import Funding from '../models/Funding.js'
import ResearchProposal from '../models/ResearchProposal.js'
import RejectedProposals from '../models/RejectedProposals.js'
import Expert from '../models/Expert.js'
import User from '../models/User.js'
import Score from '../models/Score.js'
import { ObjectId } from 'mongodb'

import sendWhatsappMessage from '../scripts/sendWhatsappMessage.js'

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
        if (research_proposal.funded) {
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
        const message = await sendWhatsappMessage("91" + user.whatsapp_number, user.first_name + " " + user.last_name, research_proposal.title, research_proposal.cid, 'proposal_funded')
        if (message.error !== undefined) {
            console.log(message.error)
            return res.json({ success: true, message: "Proposal submitted but error sending message." })
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

const getAllFundedProposals = async (req, res) => {
    try {
        const fundedProposals = await ResearchProposal.find({ funded: true })
        if (!fundedProposals) {
            return res.json({ success: false, message: 'No Funded Proposals Found.' })
        }
        return res.json({ success: true, message: 'Funded Proposals Found Successfully.', data: fundedProposals })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getAllFundedProposalsByUser = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const fundedProposals = await ResearchProposal.find({ user_id: user_id, funded: true })
        if (!fundedProposals) {
            return res.json({ success: false, message: 'No Funded Proposals Found.' })
        }
        return res.json({ success: true, message: 'Funded Proposals Found Successfully.', data: fundedProposals })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const rejectFunding = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const { reason } = req.body
        const research_proposal = await ResearchProposal.findOne({ cid: research_proposal_cid })
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (!research_proposal.submitted) {
            return res.json({ success: false, message: 'Research Proposal Not Submitted.' })
        }
        if (research_proposal.funded) {
            return res.json({ success: false, message: 'Research Proposal Already Funded.' })
        }
        const user_id = new ObjectId(research_proposal.user_id)
        const user = await User.findOne({ _id: user_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const createRejection = await RejectedProposals.create({
            data: research_proposal,
            reason: reason
        })
        if (!createRejection) {
            return res.json({ success: false, message: 'Rejection Failed.' })
        }
        const deleteFromSubmitted = await ResearchProposal.deleteOne({ _id: research_proposal._id })
        if (!deleteFromSubmitted.acknowledged) {
            return res.json({ success: false, message: 'Rejection Failed.' })
        }
        const deleteFromUser = await User.updateOne({ _id: user._id }, { $pull: { submitted_research_proposals: research_proposal_cid } })
        if (!deleteFromUser.acknowledged) {
            return res.json({ success: false, message: 'Rejection Failed.' })
        }
        const message = await sendWhatsappMessage("91" + user.whatsapp_number, user.first_name + " " + user.last_name, research_proposal.title, research_proposal.cid, 'proposal_rejected')
        if (message.error !== undefined) {
            console.log(message.error)
            return res.json({ success: true, message: "Proposal rejected but error sending message." })
        }
        return res.json({ success: true, message: 'Rejected Successfully.' })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getAllRejectedProposalsBuUser = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const rejectedProposals = await RejectedProposals.find({ 'data.user_id': user_id })
        if (!rejectedProposals) {
            return res.json({ success: false, message: 'No Rejected Proposals Found.' })
        }
        return res.json({ success: true, message: 'Rejected Proposals Found Successfully.', data: rejectedProposals })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const sendToExperts = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const experts = await User.find({ type: 'expert' })
        if (!experts) {
            return res.json({ success: false, message: 'No Experts Found.' })
        }
        for (let i = 0; i < experts.length; i++) {
            const expert = await Expert.findOne({ user_id: experts[i]._id })
            if (expert.proposals.indexOf(research_proposal_cid) !== -1) {
                return res.json({ success: false, message: 'Proposal Already Sent to Expert.' })
            }
            const proposal = await ResearchProposal.findOne({ cid: research_proposal_cid })
            if (!proposal) {
                return res.json({ success: false, message: 'Research Proposal Not Found.' })
            }
            const updateExpert = await Expert.updateOne({ user_id: experts[i]._id }, { $push: { proposals: research_proposal_cid } })
            if (!updateExpert.acknowledged) {
                return res.json({ success: false, message: 'Error Sending Proposal to Experts.' })
            }

        }
        return res.json({ success: true, message: 'Sent to experts for verification' })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getAllScoresByCid = async (req, res) => {
    try {
        const research_proposal_cid = req.params.cid
        const research_proposal = await ResearchProposal.findOne({ cid: research_proposal_cid })
        const user = await User.findOne({ _id: research_proposal.user_id })
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        const scores = await Score.find({ proposal_cid: research_proposal_cid })
        if (scores.length === 0) {
            return res.json({ success: false, message: 'No Scores Found.' })
        }
        const allScores = []
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            console.log(score)
            const expert = await User.findOne({ _id: score.expert_id })
            const expert_name = expert.first_name + " " + expert.last_name
            score.name = expert_name
            const score_data = {
                expert_name: expert_name,
                expert_id: expert._id,
                score1: score.score1,
                score2: score.score2,
                score3: score.score3,
                comments: score.comments,
            }
            allScores.push(score_data)
        }
        return res.json({ success: true, message: 'Scores Found Successfully.', data: allScores })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}
export default {
    giveFunding,
    getAllFundedProposals,
    getAllFundedProposalsByUser,
    rejectFunding,
    getAllRejectedProposalsBuUser,
    sendToExperts,
    getAllScoresByCid
}