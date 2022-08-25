import User from '../models/User.js'
import ResearchProposal from '../models/ResearchProposal.js'
import { ObjectId } from 'mongodb'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import PlagiarismReport from '../models/PlagiarismReport.js'
dotenv.config()

const levelOne = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_proposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (user._id.toString() !== research_proposal.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const allPublishedProposals = await ResearchProposal.find({ published: true, _id: { $ne: research_proposal_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedProposals.length; i++) {
            const result = await fetch('https://sih-nlp.herokuapp.com/referencesplagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_reference: allPublishedProposals[i].references,
                    },
                    sus: {
                        sus_reference: research_proposal.references
                    },
                    type: 1
                })
            })
            const data = await result.json()
            const report = { id: allPublishedProposals[i].cid, plagiarism: data.references_plag_check * 100 }
            plagiarismReport.push(report)
        }
        const createReport = await PlagiarismReport.create({
            user_id: user_id,
            research_proposal_id: research_proposal_id,
            level: 1,
            report: plagiarismReport
        })
        if (!createReport) {
            return res.json({ success: false, message: 'Error creating report.' })
        }
        return res.json({ success: true, message: 'Level 1 Plagiarism report generated successfully.', data: plagiarismReport })

    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const levelTwo = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_proposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Proposal Not Found.' })
        }
        if (user._id.toString() !== research_proposal.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const allPublishedProposals = await ResearchProposal.find({ published: true, _id: { $ne: research_proposal_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedProposals.length; i++) {
            const result = await fetch('https://sih-nlp.herokuapp.com/checkplagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_title: allPublishedProposals[i].title,
                        og_abstract: allPublishedProposals[i].abstract,
                        og_introduction: allPublishedProposals[i].introduction,
                        og_keywords: allPublishedProposals[i].keywords,
                        og_proposed_method: allPublishedProposals[i].methodology,
                        og_evaluation_result: allPublishedProposals[i].experimental_evaluation,
                        og_conclusion: allPublishedProposals[i].conclusion,
                    },
                    sus: {
                        sus_title: research_proposal.title,
                        sus_abstract: research_proposal.abstract,
                        sus_introduction: research_proposal.introduction,
                        sus_keywords: research_proposal.keywords,
                        sus_proposed_method: research_proposal.methodology,
                        sus_evaluation_result: research_proposal.experimental_evaluation,
                        sus_conclusion: research_proposal.conclusion,
                    },
                    type: 0
                })
            })
            const data = await result.json()
            const report = { id: allPublishedProposals[i].cid, plagiarism: data.similarity_score * 100 }
            plagiarismReport.push(report)
        }
        const createReport = await PlagiarismReport.create({
            user_id: user_id,
            research_proposal_id: research_proposal_id,
            level: 2,
            report: plagiarismReport
        })
        if (!createReport) {
            return res.json({ success: false, message: 'Error creating report.' })
        }
        return res.json({ success: true, message: 'Level 2 Plagiarism report generated successfully.', data: plagiarismReport })
    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getLevelOneReports = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_proposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (user._id.toString() !== research_proposal.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const report = await PlagiarismReport.find({ user_id: user_id, research_proposal_id: research_proposal_id, level: 1 })
        if (!report) {
            return res.json({ success: false, message: 'Report Not Found.' })
        }
        return res.json({ success: true, message: 'Level 1 Plagiarism report found successfully.', data: report })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

const getLevelTwoReports = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_proposal_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_proposal = await ResearchProposal.findOne({ _id: research_proposal_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_proposal) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (user._id.toString() !== research_proposal.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const report = await PlagiarismReport.find({ user_id: user_id, research_proposal_id: research_proposal_id, level: 2 })
        if (!report) {
            return res.json({ success: false, message: 'Report Not Found.' })
        }
        return res.json({ success: true, message: 'Level 2 Plagiarism report found successfully.', data: report })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Some Internal Server Error Occured.'
        })
    }
}

export default {
    levelOne,
    levelTwo,
    getLevelOneReports,
    getLevelTwoReports
}