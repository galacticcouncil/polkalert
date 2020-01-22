import db from '../db'

const logger = {
  debug: (title: string, content: string) => {
    console.log(title + '::' + content)
    db.log({
      content,
      title,
      type: 'debug'
    })
  },
  success: (title: string, content: string) => {
    console.log(title + '::' + content)
    db.log({
      content,
      title,
      type: 'success'
    })
  },
  log: (title: string, content: string) => {
    console.log(title + '::' + content)
    db.log({
      content,
      title,
      type: 'info'
    })
  },
  warn: (title: string, content: string) => {
    console.log(title + '::' + content)
    db.log({
      content,
      title,
      type: 'warn'
    })
  },
  error: (title: string, content: Error) => {
    console.error(title + '::', content)
    db.log({
      content: content.toString() + '::\n' + content.stack,
      title,
      type: 'error'
    })
  }
}

export default logger
