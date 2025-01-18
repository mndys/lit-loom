# Lit Loom

**Lit Loom** is a tool to merge multiple audio files into a single MP3 file with metadata and cover image.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/lit-loom.git
   cd lit-loom
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

## Usage

### Build the Project

To build the project, run:

```sh
pnpm build
```

### Start the Project

To start the project, run:

```sh
pnpm start
```

## Adding Files

### Adding Audio Files

1. Place your audio files in the `src/input` directory.
2. Ensure the filenames are correctly formatted and do not contain special characters.

### Adding a Cover File

> [!NOTE]
> The cover image should be a square image with a minimum resolution of 300x300 pixels and is only needed, if there is no cover image embedded in the audio files or if you would like to override the embedded cover image.

1. Place your cover image in the `src/input` directory.
2. Ensure the filename is `cover.jpg`.

### Adding Chapters Metadata

1. Create a `chapters.json` file in the `src/input` directory.
2. The `chapters.json` file should have the following structure:

   ```json
   [
     "Chapter 1",
     "Chapter 2",
     "Chapter 3",
     …
   ]
   ```

   > [!IMPORTANT]
   > The number of chapters in the `chapters.json` file should match the number of audio files in the `src/input` directory.

## Running the Merge Script

To merge the audio files and add metadata, run:

```sh
pnpm start
```

> [!NOTE]
> This will generate a merged MP3 file with the specified metadata and cover image in the `src/output` directory.

## License

This project is licensed under the ISC License.
