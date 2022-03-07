export type Seconds = number

type NanosecondsTime = `${number}us`
type MillisecondsTime = `${number}ms`
type SecondsTime = Seconds | `${Seconds}` | `${Seconds}s`
type MinutesSecondsTime = `${number}:${number}`
type HoursMinutesSecondsTime = `${number}:${MinutesSecondsTime}`
export type Time = NanosecondsTime | MillisecondsTime | SecondsTime | MinutesSecondsTime | HoursMinutesSecondsTime

const numReg = "-?\\d+(\\.\\d+)?"

export const isNanosecondsTime = (time: string): time is NanosecondsTime => {
  return new RegExp(`^${numReg}us$`).test(time)
}

export const isMillisecondsTime = (time: string): time is MillisecondsTime => {
  return new RegExp(`^${numReg}ms$`).test(time)
}

export const isSecondsTime = (time: string | number): time is SecondsTime => {
  return typeof time === "number" || new RegExp(`^${numReg}s?$`).test(time)
}

export const isMinutesSecondsTime = (time: string): time is MinutesSecondsTime => {
  return new RegExp(`^${numReg}:${numReg}$`).test(time)
}

export const isHoursMinutesSecondsTime = (time: string): time is HoursMinutesSecondsTime => {
  return new RegExp(`^${numReg}:${numReg}:${numReg}$`).test(time)
}
