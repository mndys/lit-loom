import fs from 'fs'
import { logError, logMessage } from './colored-log-messages.js'
import {
  addMetadataAndCoverToTemp,
  addMetadataAndCoverToTempAndEncode,
} from './ffmpeg-helper.js'

interface MergeFiles {
  inputFiles: string[]
  fileListPath: string
  newMetadataPath: string
  OUTPUT_PATH: string
  outputFileName: string
  TEMPORARY_MP3_FILE: string
  COVER_IMAGE_FILE: string
}

// Dateien zusammenführen
export default function mergeFiles({
  inputFiles,
  fileListPath,
  newMetadataPath,
  OUTPUT_PATH,
  outputFileName,
  TEMPORARY_MP3_FILE,
  COVER_IMAGE_FILE,
}: MergeFiles): void {
  logMessage('Führe Dateien zusammen...')

  try {
    if (inputFiles[0].endsWith('.mp3')) {
      addMetadataAndCoverToTemp({
        metadataFile: newMetadataPath,
        fileListPath,
        COVER_IMAGE_FILE,
        TEMPORARY_MP3_FILE,
      })
    } else {
      addMetadataAndCoverToTempAndEncode({
        metadataFile: newMetadataPath,
        fileListPath,
        COVER_IMAGE_FILE,
        TEMPORARY_MP3_FILE,
      })
    }
  } catch (error: any) {
    logError('Fehler beim Zusammenführen der Dateien:', error)
  }

  try {
    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.mkdirSync(OUTPUT_PATH, { recursive: true })
    }
    const outputFilePath = `${OUTPUT_PATH}/${outputFileName}`
    fs.renameSync(TEMPORARY_MP3_FILE, outputFilePath)
    logMessage(`Erfolgreich zusammengeführt: "${outputFileName}"`)
  } catch (error: any) {
    logError('Fehler beim Umbenennen der Datei:', error)
  }
}
