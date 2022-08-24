import User from '../models/User.js'
import ResearchPaper from '../models/ResearchPaper.js'
import { ObjectId } from 'mongodb'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
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
            const report = { id: allPublishedPapers[i].cid, plagiarism: data.references_plag_check*100 }
            plagiarismReport.push(report)
        }
        return res.json({ success: true, message: 'Plagiarism report generated successfully.', data: plagiarismReport })

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
    levelOne
}