import fs from 'fs'
import { logMessage } from './colored-log-messages.js'

export default function cleanupTemporaryFiles(...files: string[]): void {
  logMessage('Lösche temporäre Dateien...')

  files.forEach(file => {
    fs.unlinkSync(file)
  })
}
