import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import logger from '../logger'

let emailProvider: Mail = null
let recipient: string = null
let from: string = null

function init(settings: Settings) {
  if (emailProvider) {
    emailProvider.close()
  }

  if (
    settings.emailFrom &&
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

    from = settings.emailFrom
    recipient = settings.emailRecipient
  }
  return
}

async function send(type: string, message: string) {
  if (emailProvider) {
    let info = await emailProvider
      .sendMail({
        from: from,
        to: recipient,
        subject: type,
        text: message
      })
      .catch(e => {
        logger.error('Failed to send email notification', e)
      })

    if (info) console.log('Email message sent:', info.messageId)
  }

  return
}

export default {
  init,
  send
}
