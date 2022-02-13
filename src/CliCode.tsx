import { FC } from "react"
import styled from "styled-components"
import { formatSecondsToFfmpegTime } from "./helpers"

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
      ffmpeg -i '{input}' -ss {formatSecondsToFfmpegTime(startTime ?? 0)} -to {formatSecondsToFfmpegTime(endTime ?? 0)}{" "}
      -c copy '{output}'
    </StyledCode>
  )
}
