import {
  isHoursMinutesSecondsTime,
  isMillisecondsTime,
  isMinutesSecondsTime,
  isNanosecondsTime,
  isSecondsTime,
  Seconds,
} from "../Time"

export const decodeTimeFromString = (string: string): Seconds => {
  if (isNanosecondsTime(string)) {
    return parseFloat(string) / (1000 ^ 3)
  } else if (isMillisecondsTime(string)) {
    return parseFloat(string) / 1000
  } else if (typeof string === "number") {
    return string
  } else if (isSecondsTime(string)) {
    return parseFloat(string)
  } else if (isMinutesSecondsTime(string)) {
    const [minutes, seconds] = string.split(":")
    return Math.floor(parseFloat(minutes)) * 60 + Math.abs(parseFloat(seconds))
  } else if (isHoursMinutesSecondsTime(string)) {
    const [hours, minutes, seconds] = string.split(":")
    return (
      Math.floor(parseFloat(hours)) * 3600 +
      Math.abs(Math.floor(parseFloat(minutes))) * 60 +
      Math.abs(parseFloat(seconds))
    )
  } else {
    throw new Error(`Invalid time format for \`${string}\`.`)
  }
}
