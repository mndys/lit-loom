import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import chapterTitles from '../chapters.json' assert { type: 'json' };

// Type definitions
type Metadata = {
  [key: string]: string;
};

// Farbige Konsolenausgaben
const logError = (errorMessage: string, error?: Error): void => {
  console.error(chalk.red(`\n↪️ ${errorMessage}\n`), error?.message);
};
const logMessage = (message: string): void =>
  console.log(chalk.green(`\n↪️ ${message}\n`));
const logWarn = (warnMessage: string): void =>
  console.warn(chalk.yellow(`\n↪️ ${warnMessage}\n`));

// Hilfsfunktion: Dauer der Dateien abrufen
function getDurations(files: string[]): number[] {
  return files.map((file) => {
    const duration = execSync(
      `ffprobe -i "${file}" -show_entries format=duration -v quiet -of csv="p=0"`,
    )
      .toString()
      .trim();
    return parseFloat(duration);
  });
}

// Hilfsfunktion: Metadaten aus der ersten Datei abrufen
function getFirstFileMetadata(file: string): Metadata {
  const ffmpegMetadata = execSync(
    `ffprobe -i "${file}" -show_entries format_tags -v quiet -of json`,
  )
    .toString()
    .trim();

  const metadata = JSON.parse(ffmpegMetadata).format.tags;
  return metadata;
}

// Hilfsfunktion: Cover aus der ersten Datei abrufen
function getFirstFileCover(file: string): void {
  execSync(`ffmpeg -i "${file}" -an -vcodec copy cover.jpg`);
}

// Hilfsfunktion: Bestimmen, ob erste Datei ein Cover enthält
function hasCover(file: string): boolean {
  try {
    const result = execSync(
      `ffmpeg -i "${file}" 2>&1 | grep 'Video: mjpeg'`,
    ).toString();
    return result.includes('Video: mjpeg');
  } catch (error) {
    return false;
  }
}

// Kapitel-Metadatendatei erstellen
function createMetadataFile(durations: number[], metadata: Metadata): string {
  let meta = ';FFMETADATA1\n';
  Object.keys(metadata).forEach((item) => {
    meta += `${item}=${metadata[item]}\n`;
  });
  meta += '\n';

  let currentTime = 0;

  durations.forEach((duration, index) => {
    const start = currentTime * 1000;
    const end = (currentTime + duration) * 1000;
    currentTime += duration;

    meta += `[CHAPTER]\n`;
    meta += `TIMEBASE=1/1000\n`;
    meta += `START=${Math.floor(start)}\n`;
    meta += `END=${Math.floor(end)}\n`;
    meta += `TITLE=${chapterTitles[index]}\n\n`;
  });

  const metadataFile = 'chapters.txt';
  fs.writeFileSync(metadataFile, meta);
  return metadataFile;
}

// Dateien zusammenführen
function mergeFiles(): void {
  const inputFiles = fs
    .readdirSync(process.cwd())
    .filter((file) => file.endsWith('.m4a') || file.endsWith('.mp3'))
    .sort((a, b) => a.localeCompare(b));

  if (inputFiles.length === 0) {
    logError(
      'Keine .m4a- oder .mp3-Dateien im aktuellen Verzeichnis gefunden.',
    );
    process.exit(1);
  }

  logMessage('Gefundene Dateien:');
  inputFiles.forEach((file, index) => console.log(`${index + 1}: '${file}'`));

  try {
    logMessage('Berechne Dauer der Dateien...');
    const durations = getDurations(inputFiles);

    logMessage(
      'Metadaten der ersten Datei abrufen und Dateinamen der Zieldatei festlegen...',
    );
    const metadata = getFirstFileMetadata(inputFiles[0]);

    const sanitizeFileName = (name: string): string =>
      name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
    const outputFile = `${sanitizeFileName(metadata.title) || 'Title'} - ${
      sanitizeFileName(metadata.artist) || 'Author'
    }.mp3`;

    logMessage('Erstelle Kapitel-Metadaten...');
    const metadataFile = createMetadataFile(durations, metadata);

    logMessage('Erstelle Datei-Liste...');
    const fileList = inputFiles.map((file) => `file '${file}'`).join('\n');
    fs.writeFileSync('filelist.txt', fileList);

    logMessage('Führe Dateien zusammen...');
    execSync(
      `ffmpeg -f concat -safe 0 -i filelist.txt -i ${metadataFile} -map_metadata 1 -id3v2_version 3 -c:a libmp3lame -b:a 128k temp.mp3`,
      { stdio: 'inherit' },
    );

    logMessage('Füge allgemeine Metadaten und Cover hinzu...');

    if (hasCover(inputFiles[0])) {
      getFirstFileCover(inputFiles[0]);
    }

    if (fs.existsSync('cover.jpg')) {
      execSync(
        `ffmpeg -i temp.mp3 -i cover.jpg -map 0 -map 1 -c copy -id3v2_version 3 -metadata:s:v title="Cover" "${outputFile}"`,
        { stdio: 'inherit' },
      );
    } else {
      logWarn('Kein Cover gefunden. Die Datei wird ohne Cover erstellt.');
      fs.renameSync('temp.mp3', outputFile);
    }

    logMessage(`Erfolgreich zusammengeführt: "${outputFile}"`);

    // Temporäre Dateien entfernen
    fs.unlinkSync('filelist.txt');
    fs.unlinkSync(metadataFile);
    fs.unlinkSync('temp.mp3');
  } catch (error: any) {
    logError('Fehler beim Zusammenführen:', error);
  }
}

// Hauptfunktion ausführen
mergeFiles();
