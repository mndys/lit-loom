import { Metadata } from '../index.js'
import { logMessage } from './colored-log-messages.js'
import sanitizeFileName from './sanitizeFileName.js'

export default function generateOutputFileName(metadata: Metadata): string {
  logMessage('Dateinamen der Zieldatei festlegen...')

  const outputFile = `${
    sanitizeFileName(metadata.album) ||
    sanitizeFileName(metadata.title) ||
    'Unknown Title'
  } - ${
    sanitizeFileName(metadata.album_artist) ||
    sanitizeFileName(metadata.artist) ||
    'Unknown Author'
  }.mp3`

  console.log(outputFile)

  return outputFile
}
