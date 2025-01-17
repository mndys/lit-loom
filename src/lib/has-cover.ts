import { execSync } from 'child_process'
import { logError } from './colored-log-messages.js'

// Hilfsfunktion: Bestimmen, ob erste Datei ein Cover enthält
export function hasCover(file: string): boolean {
  try {
    const result = execSync(
      `ffmpeg -i "${file}" 2>&1 | grep 'Video: mjpeg'`
    ).toString()
    return result.includes('Video: mjpeg')
  } catch (error: any) {
    logError('Error checking for cover image:', error)
    return false
  }
}
