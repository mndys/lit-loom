import fs from 'fs'
import { logError, logMessage } from './colored-log-messages.js'

interface CreateFileListFile {
  inputFiles: string[]
  OUTPUT_PATH: string
  RELATIVE_INPUT_PATH: string
}

export default function createFileListFile({
  inputFiles,
  OUTPUT_PATH,
  RELATIVE_INPUT_PATH,
}: CreateFileListFile): string {
  logMessage('Erstelle Datei-Liste...')

  try {
    const fileList = inputFiles
      .map(file => `file '../${RELATIVE_INPUT_PATH}/${file}'`)
      .join('\n')

    const fileListPath = `${OUTPUT_PATH}/filelist.txt`

    fs.writeFileSync(fileListPath, fileList)

    return fileListPath
  } catch (error: any) {
    logError(
      'Beim Erstellen der Dateiliste ist ein Fehler aufgetreten',
      error.message
    )

    process.exit(1)
  }
}
