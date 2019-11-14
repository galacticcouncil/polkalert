import settings from '../settings'
import nodemailer from 'nodemailer'

let config = settings.get()
let email = null

function init() {
  if (config.emailPort && config.emailHost && config.emailHost) {
    email = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.emailPort === 465 ? true : false,
      auth: {
        user: config.emailUsername,
        password: config.emailPassword
      }
    })
  }
}

async function send(type, message) {
  if (email) {
    let info = await email.sendMail({
      from: '"polkalert" <info@polkalert.com>',
      to: 'bar@example.com',
      subject: type,
      text: message
    })

    console.log('Email message sent: %s', info.messageId)
  }
}

init()

export default {
  send
}
