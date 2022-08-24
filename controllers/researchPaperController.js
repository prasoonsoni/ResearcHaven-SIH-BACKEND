import { ObjectId } from 'mongodb'
import ResearchPaper from '../models/ResearchPaper.js'
import User from '../models/User.js'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid';
dotenv.config()



const createResearchPaper = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const {
            title,
            authors,
            keywords,
            abstract,
            introduction,
            literature_survey,
            proposed_work,
            methodology,
            experimental_evaluation,
            conclusion,
            references
        } = req.body
        const researchPaper = await ResearchPaper.create({
            user_id,
            title,
            authors,
            keywords,
            abstract,
            introduction,
            literature_survey,
            proposed_work,
            methodology,
            experimental_evaluation,
            conclusion,
            references
        })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Error Creating Research Paper.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            { $push: { research_papers: researchPaper._id } }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating User.' })
        }
        return res.json({ success: true, message: "Research Paper Created Successfully", data: { id: researchPaper._id } })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const editResearchPaper = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_paper_id = new ObjectId(req.params.id)
        if (!user_id || !research_paper_id) {
            return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (researchPaper.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To Edit This Research Paper.'
            })
        }
        const {
            title,
            authors,
            keywords,
            abstract,
            introduction,
            literature_survey,
            proposed_work,
            methodology,
            experimental_evaluation,
            conclusion,
            references
        } = req.body
        const updateResearchPaper = await ResearchPaper.updateOne(
            { _id: research_paper_id },
            {
                $set: {
                    title,
                    authors,
                    keywords,
                    abstract,
                    introduction,
                    literature_survey,
                    proposed_work,
                    methodology,
                    experimental_evaluation,
                    conclusion,
                    references,
                    updated_at: Date.now()
                }
            }
        )
        if (!updateResearchPaper.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Paper.' })
        }
        return res.json({ success: true, message: 'Research Paper Updated Successfully.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const deleteResearchPaper = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_paper_id = new ObjectId(req.params.id)
        if (!user_id || !research_paper_id) {
            return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (researchPaper.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To Delete This Research Paper.'
            })
        }
        const deleteResearchPaper = await ResearchPaper.deleteOne({ _id: research_paper_id })
        if (!deleteResearchPaper.acknowledged) {
            return res.json({ success: false, message: 'Error Deleting Research Paper.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            { $pull: { research_papers: research_paper_id } }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating User.' })
        }
        return res.json({ success: true, message: 'Research Paper Deleted Successfully.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getAllPublishedResearchPapers = async (req, res) => {
    try {
        const researchPapers = await ResearchPaper.find({ published: true })
        return res.json({ success: true, message: researchPapers })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getAllPublishedResearchPapersByUser = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPapers = await ResearchPaper.find({ user_id, published: true })
        return res.json({ success: true, message: "Research Paper Fetched Successfully", data: researchPapers })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getDraftResearchPapers = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPapers = await ResearchPaper.find({ user_id, published: false })
        return res.json({ success: true, message: "Research Paper Fetched Successfully", data: researchPapers })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const getDraftById = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_paper_id = new ObjectId(req.params.id)
        if (!user_id || !research_paper_id) {
            return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (researchPaper.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To View This Research Paper.'
            })
        }
        return res.json({ success: true, message: "Research Paper Fetched Successfully", data: researchPaper })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

const submitPaper = async (req, res) => {
    try {
        const user_id = new ObjectId(req.user._id)
        const research_paper_id = new ObjectId(req.params.id)
        if (!user_id || !research_paper_id) {
            return res.json({ success: false, message: 'User Or Research Paper Not Found.' })
        }
        if (!user_id) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        const researchPaper = await ResearchPaper.findOne({ _id: research_paper_id })
        if(researchPaper.published){
            return res.json({ success: false, message: 'Research Paper Already Published.' })
        }
        const user = await User.findOne({ _id: user_id })
        if (!user) {
            return res.json({ success: false, message: 'User Not Found.' })
        }
        if (!researchPaper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        if (researchPaper.user_id.toString() !== user_id.toString()) {
            return res.json({
                success: false,
                message: 'You Do Not Have Permission To View This Research Paper.'
            })
        }
        // const cid = await client.put(Buffer.from('Hello'))
        // if (!cid) {
        //     return res.json({ success: false, message: 'Error Uploading Paper To IPFS.' })
        // }
        const cid = uuidv4()
        const updateResearchPaper = await ResearchPaper.updateOne(
            { _id: research_paper_id },
            { $set: { cid: cid, published: true } }
        )
        if (!updateResearchPaper.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Paper.' })
        }
        const updateUser = await User.updateOne(
            { _id: user_id },
            {
                $push: { published_research_papers: cid },
                $pull: { research_papers: research_paper_id }
            }
        )
        if (!updateUser.acknowledged) {
            return res.json({ success: false, message: 'Error Updating Research Paper.' })
        }
        return res.json({ success: true, message: 'Paper Uploaded Successfully.', data: cid })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}
const getPublishedResearchPaperById = async(req, res)=>{
    try {
        const cid = req.params.cid
        const researchPaper = await ResearchPaper.findOne({ cid })
        if (!researchPaper) {
            return res.json({ success: false, message: 'Research Paper Not Found.' })
        }
        return res.json({ success: true, message: "Research Paper Fetched Successfully", data: researchPaper })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: 'Some Internal Server Error Occured.' })
    }
}

export default {
    createResearchPaper,
    editResearchPaper,
    deleteResearchPaper,
    getAllPublishedResearchPapers,
    getPublishedResearchPaperById,
    getAllPublishedResearchPapersByUser,
    getDraftResearchPapers,
    getDraftById,
    submitPaper
}
