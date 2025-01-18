import { execSync } from 'child_process'
import { logMessage } from './colored-log-messages.js'

// Hilfsfunktion: Dauer der Dateien abrufen
export function getDurations(files: string[], INPUT_PATH: string): number[] {
  logMessage('Berechne Dauer der Dateien...')

  return files.map(file => {
    const duration = execSync(
      `ffprobe -i "${INPUT_PATH}/${file}" -show_entries format=duration -v quiet -of csv="p=0"`
    )
      .toString()
      .trim()
    return parseFloat(duration)
  })
}
