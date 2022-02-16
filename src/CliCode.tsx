import { useEffect } from "react"
import { FC, useState } from "react"
import styled from "styled-components"
import { formatSecondsToFfmpegTime } from "./helpers"

const Layout = styled.section`
  grid-area: cli;
  border-left: 1px solid #272727;
  background: #141414;
  line-height: 2;
  font-size: 18px;
  overflow: auto;
`

const Code = styled.pre`
  width: min-content;
  padding: 30px;
`

interface CliCodeProps {
  file?: File | null
  startTime?: number
  endTime?: number
}

export const CliCode: FC<CliCodeProps> = ({ file, startTime, endTime }) => {
  const input = file?.name ?? "<input>"
  const [outputName, setOutputName] = useState("<output>")
  const [outputExtension, setOutputExtension] = useState("")

  useEffect(() => {
    if (!file) return
    const [extension, ...name] = file.name.split(".").reverse()
    setOutputName(name.reverse().join(".") + " (edited)")
    setOutputExtension(extension)
  }, [file])

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.code !== "KeyR") return
      const newName = prompt("New output name (without extension)")
      if (newName) setOutputName(newName)
    }

    window.addEventListener("keypress", handleKeypress)
    return () => window.removeEventListener("keypress", handleKeypress)
  }, [])

  return (
    <Layout>
      <Code>
        ffmpeg \
        <br />
        {"  "}-i '{input}' \
        <br />
        {"  "}-ss {formatSecondsToFfmpegTime(startTime ?? 0)} \
        <br />
        {"  "}-to {formatSecondsToFfmpegTime(endTime ?? 0)} \<br />
        {"  "}-c copy \
        <br />
        {"  "}'{outputName}
        {outputExtension && `.${outputExtension}`}'
      </Code>
    </Layout>
  )
}
