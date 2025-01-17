import { execSync } from 'child_process'
import { COVER_IMAGE_FILE } from '../index.js'

// Hilfsfunktion: Cover aus der ersten Datei abrufen
export function getFirstFileCover(file: string): void {
  try {
    execSync(`ffmpeg -i "${file}" -an -vcodec copy "${COVER_IMAGE_FILE}"`)
  } catch (error) {
    console.error('Error extracting cover image:', error)
  }
}
