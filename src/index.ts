#!/usr/bin/env ts-node

import { execSync } from 'child_process'
import fs from 'fs'
import { logError, logMessage, logWarn } from './lib/colored-log-messages.js'
import createMetadataFile from './lib/create-metadata-file.js'
import { getDurations } from './lib/get-durations.js'
import { getFirstFileCover } from './lib/get-first-file-cover.js'
import { getFirstFileMetadata } from './lib/get-first-file-metadata.js'
import { hasCover } from './lib/has-cover.js'

// Type definitions
export type Metadata = {
  [key: string]: string
}

// Constants
const ALLOWED_AUDIO_EXTENSIONS = ['.m4a', '.mp3', '.m4b', '.wav']
const TEMPORARY_MP3_FILE = 'temp.mp3'
const COVER_IMAGE_FILE = 'src/input/cover.jpg'
const OUTPUT_PATH = 'src/output'
export const INPUT_PATH = 'src/input'

// Dateien zusammenführen
function mergeFiles(): void {
  const inputFiles = fs
    .readdirSync(INPUT_PATH)
    .filter(file =>
      ALLOWED_AUDIO_EXTENSIONS.some(extension =>
        file.toLowerCase().endsWith(extension)
      )
    )
    .sort((a, b) => a.localeCompare(b))

  if (inputFiles.length === 0) {
    logError('Keine Audio-Dateien gefunden.')
    process.exit(1)
  }

  logMessage('Gefundene Dateien:')
  inputFiles.forEach((file, index) => console.log(`${index + 1}: '${file}'`))

  try {
    logMessage('Berechne Dauer der Dateien...')
    const durations = getDurations(inputFiles)

    logMessage(
      'Metadaten der ersten Datei abrufen und Dateinamen der Zieldatei festlegen...'
    )
    const metadata = getFirstFileMetadata(inputFiles[0])

    const sanitizeFileName = (name: string): string =>
      name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim()
    const outputFile = `${sanitizeFileName(metadata.title) || 'Unknown Title'} - ${
      sanitizeFileName(metadata.artist) || 'Unknown Author'
    }.mp3`

    logMessage('Erstelle Kapitel-Metadaten...')
    const metadataFile = createMetadataFile(durations, metadata)

    logMessage('Erstelle Datei-Liste...')
    const fileList = inputFiles
      .map(file => `file '${INPUT_PATH}/${file}'`)
      .join('\n')
    fs.writeFileSync('filelist.txt', fileList)

    logMessage('Führe Dateien zusammen...')
    execSync(
      `ffmpeg -f concat -safe 0 -i filelist.txt -i ${metadataFile} -map_metadata 1 -id3v2_version 3 -c:a libmp3lame -b:a 128k "${TEMPORARY_MP3_FILE}"`,
      { stdio: 'inherit' }
    )

    logMessage('Füge allgemeine Metadaten und Cover hinzu...')

    const addCoverAndDeleteTempFile = () => {
      execSync(
        `ffmpeg -i ${TEMPORARY_MP3_FILE} -i ${COVER_IMAGE_FILE} -map 0 -map 1 -c copy -id3v2_version 3 -metadata:s:v title="Cover" -y "${outputFile}"`,
        { stdio: 'inherit' }
      )
      fs.unlinkSync(TEMPORARY_MP3_FILE)
    }

    if (fs.existsSync(COVER_IMAGE_FILE)) {
      addCoverAndDeleteTempFile()
    } else if (hasCover(inputFiles[0])) {
      getFirstFileCover(inputFiles[0])
      if (fs.existsSync(COVER_IMAGE_FILE)) {
        addCoverAndDeleteTempFile()
      }
    } else {
      logWarn('Kein Cover gefunden. Die Datei wird ohne Cover erstellt.')
      fs.renameSync(TEMPORARY_MP3_FILE, outputFile)
    }

    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.mkdirSync(OUTPUT_PATH, { recursive: true })
    }
    const outputFilePath = `${OUTPUT_PATH}/${outputFile}`
    fs.renameSync(outputFile, outputFilePath)
    logMessage(`Datei gespeichert unter: "${outputFilePath}"`)

    logMessage(`Erfolgreich zusammengeführt: "${outputFile}"`)

    // Temporäre Dateien entfernen
    fs.unlinkSync('filelist.txt')
    fs.unlinkSync(metadataFile)
  } catch (error: any) {
    logError('Fehler beim Zusammenführen:', error)
  }
}

// Hauptfunktion ausführen
mergeFiles()
