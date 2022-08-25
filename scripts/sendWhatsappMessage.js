import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const sendWhatsappMessage = async (to, name, title, id, template) => {
    try {
        const response = await fetch('https://graph.facebook.com/v14.0/108052902029952/messages',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.WHATSAPP_TOKEN
                },
                body:
                    JSON.stringify({
                        "messaging_product": "whatsapp",
                        "to": to,
                        "type": "template",
                        "template": {
                            "name": template,
                            "language": {
                                "code": "en"
                            },
                            "components": [
                                {
                                    "type": "body",
                                    "parameters": [
                                        {
                                            "type": "text",
                                            "text": name
                                        },
                                        {
                                            "type": "text",
                                            "text": title
                                        },
                                        {
                                            "type": "text",
                                            "text": id
                                        }
                                    ]
                                }
                            ]
                        }
                    })
            })
        const result = await response.json()
        return result
    } catch (error) {
        console.log(error)
    }
}

export default sendWhatsappMessage