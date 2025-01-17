import { execSync } from 'child_process'

// Hilfsfunktion: Bestimmen, ob erste Datei ein Cover enthält
export function hasCover(file: string): boolean {
  try {
    const result = execSync(
      `ffmpeg -i "${file}" 2>&1 | grep 'Video: mjpeg'`
    ).toString()
    return result.includes('Video: mjpeg')
  } catch (error) {
    return false
  }
}
