import User from '../models/User.js'
import ResearchPaper from '../models/ResearchPaper.js'
import { ObjectId } from 'mongodb'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import PlagiarismReport from '../models/PlagiarismReport.js'
dotenv.config()

const levelOne = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_paper_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_paper = await ResearchPaper.findOne({ _id: research_paper_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_paper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (user._id.toString() !== research_paper.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const allPublishedPapers = await ResearchPaper.find({ published: true, _id: { $ne: research_paper_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedPapers.length; i++) {
            const result = await fetch('https://sih-nlp.herokuapp.com/referencesplagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_reference: allPublishedPapers[i].references,
                    },
                    sus: {
                        sus_reference: research_paper.references
                    },
                    type: 1
                })
            })
            const data = await result.json()
            const report = { id: allPublishedPapers[i].cid, plagiarism: data.references_plag_check * 100 }
            plagiarismReport.push(report)
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
        const research_paper_id = new ObjectId(req.params.id)
        const user = await User.findOne({ _id: user_id })
        const research_paper = await ResearchPaper.findOne({ _id: research_paper_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!research_paper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (user._id.toString() !== research_paper.user_id.toString()) {
            return res.json({ success: false, message: 'You are not authorized to access this resource.' })
        }
        const allPublishedPapers = await ResearchPaper.find({ published: true, _id: { $ne: research_paper_id } })
        const plagiarismReport = []
        for (let i = 0; i < allPublishedPapers.length; i++) {
            const result = await fetch('https://sih-nlp.herokuapp.com/checkplagiarism/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    og: {
                        og_title: allPublishedPapers[i].title,
                        og_abstract: allPublishedPapers[i].abstract,
                        og_introduction: allPublishedPapers[i].introduction,
                        og_keywords: allPublishedPapers[i].keywords,
                        og_proposed_method: allPublishedPapers[i].methodology,
                        og_evaluation_result: allPublishedPapers[i].experimental_evaluation,
                        og_conclusion: allPublishedPapers[i].conclusion,
                    },
                    sus: {
                        sus_title: research_paper.title,
                        sus_abstract: research_paper.abstract,
                        sus_introduction: research_paper.introduction,
                        sus_keywords: research_paper.keywords,
                        sus_proposed_method: research_paper.methodology,
                        sus_evaluation_result: research_paper.experimental_evaluation,
                        sus_conclusion: research_paper.conclusion,
                    },
                    type: 0
                })
            })
            const data = await result.json()
            const report = { id: allPublishedPapers[i].cid, plagiarism: data.similarity_score * 100 }
            plagiarismReport.push(report)
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

export default {
    levelOne,
    levelTwo
}