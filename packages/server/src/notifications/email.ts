import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

let emailProvider: Mail = null
let recipient = null

function init(settings: Settings) {
  if (emailProvider) {
    emailProvider.close()
  }

  if (
    settings.emailPort &&
    settings.emailHost &&
    settings.emailUsername &&
    settings.emailPassword &&
    settings.emailRecipient
  ) {
    emailProvider = nodemailer.createTransport({
      host: settings.emailHost,
      port: settings.emailPort,
      secure: settings.emailPort === 465 ? true : false,
      auth: {
        user: settings.emailUsername,
        pass: settings.emailPassword
      }
    })
  }
  return
}

async function send(type, message) {
  if (emailProvider) {
    let info = await emailProvider.sendMail({
      from: '"polkalert" <info@polkalert.com>',
      to: recipient,
      subject: type,
      text: message
    })

    console.log('Email message sent: %s', info.messageId)
  }

  return
}

export default {
  init,
  send
}
