import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()
const sendMail = async (to, url) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		})
		const mailOptions = {
			from: `"Web Crawlers 👨‍💻 <${process.env.EMAIL}>`,
			to,
			subject: 'Do Not Reply - Email Verification ✔️',
			html: `<h1>Welcome to the Research Paper Portal</h1>
                    <p>Hi there,</p>
                    <p>Please click the link below or copy paste in browser to verify your email address.</p>
                    <button><a href="${url}">Verify Email</a></button>
                    <p><a href="${url}">${url}</a></p>
                    <p>Thank you,</p>
                    <p>Web Crawlers</p>`
		}
		const info = await transporter.sendMail(mailOptions)
		return info
	} catch (error) {
		console.log(error)
	}
}

export default sendMail
