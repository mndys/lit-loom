export default function sanitizeFileName(
  name: string | undefined
): string | undefined {
  if (!name) {
    return undefined
  }
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim()
}
