import { FC } from "react"
import styled from "styled-components"

const StyledCode = styled.code`
  display: block;
  margin: 30px;
  text-align: center;
  font-size: 15px;
`

interface CliCodeProps {
  file?: File | null
  startTime?: number
  endTime?: number
}

export const CliCode: FC<CliCodeProps> = ({ file, startTime, endTime }) => {
  const input = file?.name ?? "<input>"
  const output = file?.name ?? "<output>"
  return (
    <StyledCode>
      ffmpeg -i {input} -ss {formatSecondsToFfmpegTime(startTime ?? 0)} -to {formatSecondsToFfmpegTime(endTime ?? 0)} -c
      copy {output}
    </StyledCode>
  )
}

const formatSecondsToFfmpegTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 3600

  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  seconds = seconds % 60

  const s = Math.round(seconds).toString().padStart(2, "0")

  return `${h}:${m}:${s}`
}
