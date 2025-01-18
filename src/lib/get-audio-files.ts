import fs from 'fs'
import { logError, logMessage } from './colored-log-messages.js'

export const ALLOWED_AUDIO_EXTENSIONS = ['.m4a', '.mp3', '.m4b', '.wav']

// Audio-Dateien im Input-Verzeichnis auslesen
export default function getAudioFiles(INPUT_PATH: string): string[] {
  const inputFiles = fs
    .readdirSync(INPUT_PATH)
    .filter(file =>
      ALLOWED_AUDIO_EXTENSIONS.some(extension =>
        file.toLowerCase().endsWith(extension)
      )
    )
    .sort((a, b) => a.localeCompare(b))

  if (inputFiles.length === 0) {
    logError('Keine Audio-Dateien gefunden.')
    process.exit(1)
  }

  logMessage('Gefundene Dateien:')
  inputFiles.forEach((file, index) => console.log(`${index + 1}: '${file}'`))
  return inputFiles
}
