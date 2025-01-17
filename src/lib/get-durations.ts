import { execSync } from 'child_process'

// Hilfsfunktion: Dauer der Dateien abrufen
export function getDurations(files: string[]): number[] {
  return files.map(file => {
    const duration = execSync(
      `ffprobe -i "${file}" -show_entries format=duration -v quiet -of csv="p=0"`
    )
      .toString()
      .trim()
    return parseFloat(duration)
  })
}
