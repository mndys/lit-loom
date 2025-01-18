#!/usr/bin/env ts-node

import chapterTitles from './input/chapters.json' assert { type: 'json' }
import cleanupTemporaryFiles from './lib/cleanup-temporary-files.js'
import { logError, logMessage, logSpecial } from './lib/colored-log-messages.js'
import createFileListFile from './lib/create-file-list-file.js'
import createMetadataFile from './lib/create-metadata-file.js'
import generateOutputFileName from './lib/generate-output-file-name.js'
import getAudioFiles from './lib/get-audio-files.js'
import { getDurations } from './lib/get-durations.js'
import { getFirstFileMetadata } from './lib/get-first-file-metadata.js'
import mergeFiles from './lib/merge-files.js'

// Type definitions
export type Metadata = {
  [key: string]: string
}

// Files and paths Constants
export const INPUT_PATH = 'src/input'
export const RELATIVE_INPUT_PATH = 'input'
export const OUTPUT_PATH = 'src/output'
export const RELATIVE_OUTPUT_PATH = 'output'

export const COVER_IMAGE_FILE = `${INPUT_PATH}/cover.jpg`
export const OUTPUT_FILE = `${OUTPUT_PATH}/output.mp3`
export const TEMPORARY_MP3_FILE = `${OUTPUT_PATH}/temp.mp3`

// Vorbereitung

// ACTION
export const inputFiles = getAudioFiles(INPUT_PATH)
const originalMetadata = getFirstFileMetadata(
  inputFiles[0],
  COVER_IMAGE_FILE,
  INPUT_PATH
)
const outputFileName = generateOutputFileName(originalMetadata)
const durations = getDurations(inputFiles, INPUT_PATH)

logMessage('Erstelle Kapitel-Metadaten...')
const newMetadataPath = createMetadataFile({
  durations,
  metadata: originalMetadata,
  OUTPUT_PATH,
  chapterTitles,
})

const fileListPath = createFileListFile({
  inputFiles,
  OUTPUT_PATH,
  RELATIVE_INPUT_PATH,
})

// Hauptfunktion ausführen
mergeFiles({
  inputFiles,
  fileListPath,
  newMetadataPath,
  OUTPUT_PATH,
  outputFileName,
  TEMPORARY_MP3_FILE,
  COVER_IMAGE_FILE,
})

// Temporäre Dateien entfernen
try {
  cleanupTemporaryFiles(fileListPath, newMetadataPath)
} catch (error: any) {
  logError('Fehler beim Bereinigen der temporären Dateien:', error)
} finally {
  logSpecial('Fertig! 🎉')
}
