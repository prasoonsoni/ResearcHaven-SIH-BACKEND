import { ObjectId } from 'mongodb'
import ResearchProposal from '../models/ResearchProposal.js'
import User from '../models/User.js'
import dotenv from 'dotenv'
import sendWhatsappMessage from '../scripts/sendWhatsappMessage.js'
import { v4 as uuidv4 } from 'uuid';
dotenv.config()

const createResearchProposal = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const {
            title,
            researchers,
            keywords,
            introduction,
            problem_statement_and_objectives,
            literature_review,
            methodology,
            bibliography
        } = req.body
        const researchProposal = await ResearchProposal.create({
            user_id,
            title,
            researchers,
            keywords,
            introduction,
            problem_statement_and_objectives,
            literature_review,
            methodology,
            bibliography
        })
        if (!researchProposal) {
            return res.json({ success: false, message: 'Error Creating Research Proposal.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            { $push: { research_proposals: researchProposal._id } }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating User.' })
        }
        return res.json({ success: true, message: "Research Proposal Created Successfully", data: { id: researchProposal._id } })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const editResearchProposal = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        if (!user_id || !research_proposal_id) {
            return res.json({ success: false, message: 'User Or Research Proposal Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (researchProposal.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To Edit This Research Proposal.'
            })
        }
        const {
            title,
            researchers,
            keywords,
            introduction,
            problem_statement_and_objectives,
            literature_review,
            methodology,
            bibliography
        } = req.body
        const updateResearchProposal = await ResearchProposal.updateOne(
            { _id: research_proposal_id },
            {
                $set: {
                    title,
                    researchers,
                    keywords,
                    introduction,
                    problem_statement_and_objectives,
                    literature_review,
                    methodology,
                    bibliography,
                    updated_at: Date.now()
                }
            }
        )
        if (!updateResearchProposal.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Proposal.' })
        }
        return res.json({ success: true, message: 'Research Proposal Updated Successfully.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const deleteResearchProposal = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        if (!user_id || !research_proposal_id) {
            return res.json({ success: false, message: 'User Or Research Proposal Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (researchProposal.submitted) {
            return res.json({ success: false, message: 'You Cannot Delete A Submitted Research Proposal.' })
        }
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (researchProposal.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To Delete This Research Proposal.'
            })
        }
        const deleteResearchProposal = await ResearchProposal.deleteOne({ _id: research_proposal_id })
        if (!deleteResearchProposal.acknowledged) {
            return res.json({ success: false, message: 'Error Deleting Research Proposal.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            { $pull: { research_proposals: research_proposal_id } }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating User.' })
        }
        return res.json({ success: true, message: 'Research Proposal Deleted Successfully.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getAllSubmittedResearchProposals = async (req, res) => {
    try {
        const researchProposals = await ResearchProposal.find({ submitted: true, funded: false })
        return res.json({ success: true, message: "Research Proposals Fetched Successfully", data: researchProposals })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getAllSubmittedResearchProposalsByUser = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposals = await ResearchProposal.find({ user_id, submitted: true, funded: false })
        return res.json({ success: true, message: "Research Proposal Fetched Successfully", data: researchProposals })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getDraftResearchProposals = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposals = await ResearchProposal.find({ user_id, submitted: false })
        return res.json({ success: true, message: "Research Proposal Fetched Successfully", data: researchProposals })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getDraftById = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        if (!user_id || !research_proposal_id) {
            return res.json({ success: false, message: 'User Or Research Proposal Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (researchProposal.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To View This Research Proposal.'
            })
        }
        return res.json({ success: true, message: "Research Proposal Fetched Successfully", data: researchProposal })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const submitProposal = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        if (!user_id || !research_proposal_id) {
            return res.json({ success: false, message: 'User Or Research Proposal Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchProposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (researchProposal.submitted) {
            return res.json({ success: false, message: 'Research Proposal Already Submitted.' })
        }
        const user = await User.findOne({ _id: user_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (researchProposal.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To View This Research Proposal.'
            })
        }
        // const cid = await client.put(Buffer.from('Hello'))
        // if (!cid) {
        //     return res.json({ success: false, message: 'Error Uploading Proposal To IPFS.' })
        // }
        const cid = uuidv4()
        const updateResearchProposal = await ResearchProposal.updateOne(
            { _id: research_proposal_id },
            { $set: { cid: cid, submitted: true } }
        )
        if (!updateResearchProposal.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Proposal.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            {
                $push: { submitted_research_proposals: cid },
                $pull: { research_proposals: research_proposal_id }
            }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Proposal.' })
        }
        const message = await sendWhatsappMessage("91" + user.whatsapp_number, user.first_name + " " + user.last_name, researchProposal.title, cid, 'submit_proposal')
        if (message.error !== undefined) {
            console.log(message.error)
            return res.json({ success: false, message: "Proposal submitted but error sending message." })
        }
        return res.json({ success: true, message: 'Proposal Uploaded Successfully.', data: cid })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}
const getSubmittedResearchProposalById = async (req, res) => {
    try {
        const cid = req.params.cid
        const researchProposal = await ResearchProposal.findOne({ cid })
        if (!researchProposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        return res.json({ success: true, message: "Research Proposal Fetched Successfully", data: researchProposal })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

export default {
    createResearchProposal,
    editResearchProposal,
    deleteResearchProposal,
    getAllSubmittedResearchProposals,
    getSubmittedResearchProposalById,
    getAllSubmittedResearchProposalsByUser,
    getDraftResearchProposals,
    getDraftById,
    submitProposal
}
