import fs from 'fs'
import { Metadata } from '../index.js'

interface CreateMetadataFile {
  durations: number[]
  metadata: Metadata
  OUTPUT_PATH: string
  chapterTitles: string[]
}

// Kapitel-Metadatendatei erstellen
export default function createMetadataFile({
  durations,
  metadata,
  OUTPUT_PATH,
  chapterTitles,
}: CreateMetadataFile): string {
  let meta = ';FFMETADATA1\n'

  Object.keys(metadata).forEach(item => {
    meta += `${item}=${metadata[item]}\n`
  })

  meta += '\n'

  let currentTime = 0

  durations.forEach((duration, index) => {
    const start = currentTime * 1000
    const end = (currentTime + duration) * 1000
    currentTime += duration

    meta += `[CHAPTER]\n`
    meta += `TIMEBASE=1/1000\n`
    meta += `START=${Math.floor(start)}\n`
    meta += `END=${Math.floor(end)}\n`
    meta += `TITLE=${chapterTitles[index]}\n\n`
  })

  const metadataFilePath = `${OUTPUT_PATH}/chapters.txt`
  fs.writeFileSync(metadataFilePath, meta)

  return metadataFilePath
}
