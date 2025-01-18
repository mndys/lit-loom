import { execSync } from 'child_process'

interface MetadataAndCover {
  metadataFile: string
  fileListPath: string
  COVER_IMAGE_FILE: string
  TEMPORARY_MP3_FILE: string
}

export function addMetadataAndCoverToTempAndEncode({
  metadataFile,
  fileListPath,
  COVER_IMAGE_FILE,
  TEMPORARY_MP3_FILE,
}: MetadataAndCover) {
  execSync(
    `ffmpeg -f concat -safe 0 -i ${fileListPath} -i ${metadataFile} -i ${COVER_IMAGE_FILE} -map_metadata 1 -map 0:a -map 2 -c copy -id3v2_version 3 -c:a libmp3lame -b:a 128k -metadata:s:v title="Cover" -metadata:s:v comment="Cover (front)" "${TEMPORARY_MP3_FILE}"`,
    { stdio: 'inherit' }
  )
}

export function addMetadataAndCoverToTemp({
  metadataFile,
  fileListPath,
  COVER_IMAGE_FILE,
  TEMPORARY_MP3_FILE,
}: MetadataAndCover) {
  execSync(
    `ffmpeg -f concat -safe 0 -i ${fileListPath} -i ${metadataFile} -i ${COVER_IMAGE_FILE} -map_metadata 1 -map 0:a -map 2 -c copy -id3v2_version 3 -metadata:s:v title="Cover" -metadata:s:v comment="Cover (front)" -c copy "${TEMPORARY_MP3_FILE}"`,
    { stdio: 'inherit' }
  )
}
