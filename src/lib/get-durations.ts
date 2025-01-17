import { execSync } from 'child_process'
import { AUDIO_PATH } from '../index.js'

// Hilfsfunktion: Dauer der Dateien abrufen
export function getDurations(files: string[]): number[] {
  return files.map(file => {
    const duration = execSync(
      `ffprobe -i "${AUDIO_PATH}/${file}" -show_entries format=duration -v quiet -of csv="p=0"`
    )
      .toString()
      .trim()
    return parseFloat(duration)
  })
}
