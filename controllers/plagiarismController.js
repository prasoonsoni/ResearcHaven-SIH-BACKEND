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
        const allPublishedProposals = await ResearchProposal.find({ funded: true, _id: { $ne: research_proposal_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedProposals.length; i++) {
            const result = await fetch('https://sih-nlp.herokuapp.com/level1plagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_keywords: allPublishedProposals[i].keywords,
                        og_bibliography: allPublishedProposals[i].bibliography,
                        og_literature_review: allPublishedProposals[i].literature_review
                    },
                    sus: {
                        sus_keywords: research_proposal.keywords,
                        sus_bibliography: research_proposal.bibliography,
                        sus_literature_review: research_proposal.literature_review
                    },
                    type: 0
                })
            })
            const data = await result.json()
            const report = { id: allPublishedProposals[i].cid, plagiarism: data.level1_check * 100 }
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
        const allPublishedProposals = await ResearchProposal.find({ funded: true, _id: { $ne: research_proposal_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedProposals.length; i++) {
            console.log(allPublishedProposals[i])
            const result = await fetch('https://sih-nlp.herokuapp.com/checkplagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_title: allPublishedProposals[i].title,
                        og_ps_obj: allPublishedProposals[i].problem_statement_and_objectives,
                        og_introduction: allPublishedProposals[i].introduction,
                        og_keywords: allPublishedProposals[i].keywords,
                        og_proposed_method: allPublishedProposals[i].methodology
                    },
                    sus: {
                        sus_title: research_proposal.title,
                        sus_ps_obj: research_proposal.problem_statement_and_objectives,
                        sus_introduction: research_proposal.introduction,
                        sus_keywords: research_proposal.keywords,
                        sus_proposed_method: research_proposal.methodology
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