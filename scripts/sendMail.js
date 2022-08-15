require('dotenv').config()
const nodemailer = require('nodemailer')
const sendMail = async (to, url) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: `"Web Crawlers 👨‍💻 <${process.env.EMAIL}>`,
            to: to,
            subject: "Do Not Reply - Email Verification ✔️",
            html: `<p>Hi there,</p>
            <p>Please click the link below to verify your email address.</p>
            <p><a href="${url}">${url}</a></p>
            <p>Thanks,</p>
            <p>Web Crawlers</p>`
        }
        const info = await transporter.sendMail(mailOptions)
        return info
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail