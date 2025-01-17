import { execSync } from 'child_process'
import { AUDIO_PATH, Metadata } from '../index.js'

// Hilfsfunktion: Metadaten aus der ersten Datei abrufen
export function getFirstFileMetadata(file: string): Metadata {
  const ffmpegMetadata = execSync(
    `ffprobe -i "${AUDIO_PATH}/${file}" -show_entries format_tags -v quiet -of json`
  )
    .toString()
    .trim()

  const metadata = JSON.parse(ffmpegMetadata).format.tags
  return metadata
}
