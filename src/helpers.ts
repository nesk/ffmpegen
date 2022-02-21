export const isMacos = (userAgent: string) => userAgent.includes("Macintosh")

export const formatSecondsToFfmpegTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 3600

  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 60

  const s = Math.round(seconds).toString().padStart(2, "0")

  const ms = Math.round((seconds - Math.floor(seconds)) * 1000)
    .toString()
    .padEnd(3, "0")

  return `${h}:${m}:${s}.${ms}`
}
