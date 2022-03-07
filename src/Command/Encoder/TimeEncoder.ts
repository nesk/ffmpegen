import { Seconds } from "../Time"

export const encodeTimeToString = (seconds: Seconds) => {
  const minus = seconds < 0 ? "-" : ""
  seconds = Math.abs(seconds)

  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 3600

  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 60

  const s = Math.floor(seconds).toString().padStart(2, "0")

  const ms = Math.round((seconds - Math.floor(seconds)) * 1000).toString()

  return `${minus}${h}:${m}:${s}.${ms}`
}
