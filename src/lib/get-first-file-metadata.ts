import { execSync } from 'child_process'
import fs from 'fs'
import readlineSync from 'readline-sync'
import { Metadata } from '../index.js'
import { logError, logMessage, logWarn } from './colored-log-messages.js'

// Hilfsfunktion: Metadaten aus der ersten Datei abrufen
export function getFirstFileMetadata(
  file: string,
  COVER_IMAGE_FILE: string,
  INPUT_PATH: string
): Metadata {
  logMessage('Metadaten für die erste Datei abrufen...')

  // Metadaten als JSON-String auslesen
  try {
    const ffprobeOutput = execSync(
      `ffprobe -i "${INPUT_PATH}/${file}" -show_format -show_streams -v quiet -of json`
    )
      .toString()
      .trim()

    // JSON-String in Objekt umwandeln und metadata-Objekt extrahieren
    const ffmpegMetadata = JSON.parse(ffprobeOutput)
    const metadata = ffmpegMetadata.format.tags

    // Titel und Album abgleichen
    if (metadata.album) {
      metadata.title = metadata.album
    } else if (metadata.title) {
      metadata.album = metadata.title
    }
    if (!metadata.album && !metadata.title) {
      const userInput = readlineSync.question('Wie soll das Hörbuch heißen? ')
      metadata.album = userInput
      metadata.title = userInput
    }

    // auf Cover prüfen
    const coverStream = ffmpegMetadata.streams.some(
      (stream: any) =>
        stream.codec_type === 'video' && stream.codec_name === 'mjpeg'
    )

    if (coverStream && !fs.existsSync(COVER_IMAGE_FILE)) {
      logMessage('Cover gefunden. Extrahiere...')

      // Cover extrahieren
      execSync(
        `ffmpeg -i "${INPUT_PATH}/${file}" -an -c:v copy "${COVER_IMAGE_FILE}"`
      )
    } else {
      logWarn(
        'Kein Cover gefunden oder es existiert bereits ein Cover im input-Ordner.'
      )
    }

    return metadata
  } catch (error: any) {
    logError('Metadaten konnten nicht ausgelesen werden', error.message)
    process.exit(1)
  }
}
