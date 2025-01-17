import { execSync } from 'child_process'

// Verzeichnisse mit Dateien
// Hilfsfunktion: Cover aus der ersten Datei abrufen
export function getFirstFileCover(file: string): void {
  execSync(`ffmpeg -i "${file}" -an -vcodec copy cover.jpg`)
}
