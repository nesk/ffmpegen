import { useCallback, useEffect } from "react"
import { FC, useState } from "react"
import styled from "styled-components"
import { isMacos } from "./helpers"
import { ReactComponent as CopyIcon } from "./assets/copy.svg"
import { ReactComponent as CheckIcon } from "./assets/check.svg"
import { encodeTimeToString } from "./Command/Encoder/TimeEncoder"

const Layout = styled.section`
  grid-area: cli;
  border-left: 1px solid #272727;
  background: #141414;
  line-height: 2;
  font-size: 18px;
  overflow: auto;

  &:not(:hover) {
    button {
      visibility: hidden;
    }
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`

const Code = styled.pre`
  width: min-content;
  padding: 30px;
`

const Button = styled.button`
  appearance: none;
  display: flex;
  border: 1px solid #272727;
  border-radius: 6px;
  padding: 10px;
  background-color: #1e1e1e;
  color: #b7b7b7;
  cursor: pointer;

  &:hover {
    border-color: currentColor;
    color: #ffcc01;
  }

  svg {
    width: 18px;
  }
`
interface CopyButtonProps {
  readonly onClick: () => void
}

const CopyButton: FC<CopyButtonProps> = ({ onClick }) => {
  const [didCopy, setDidCopy] = useState(false)

  const handleClick = () => {
    onClick()
    setDidCopy(true)
    setTimeout(() => setDidCopy(false), 1500)
  }

  return (
    <Button
      onClick={didCopy ? undefined : handleClick}
      style={didCopy ? { borderColor: "currentColor", color: "#6aeb1b" } : {}}
      title="Copy"
    >
      {didCopy ? <CheckIcon style={{ transform: "scale(0.9)" }} /> : <CopyIcon />}
    </Button>
  )
}

interface CliCodeProps {
  file?: File | null
  startTime?: number
  endTime?: number
}

export const CliCode: FC<CliCodeProps> = ({ file, startTime, endTime }) => {
  const input = file?.name ?? "<input>"
  const [outputName, setOutputName] = useState("<output>")
  const [outputExtension, setOutputExtension] = useState("")

  // Update the output name when the file changes
  useEffect(() => {
    if (!file) return
    const [extension, ...name] = file.name.split(".").reverse()
    setOutputName(name.reverse().join(".") + " (edited)")
    setOutputExtension(extension)
  }, [file])

  // Allow to rename the output file when pressing "R"
  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.code !== "KeyR") return
      const newName = prompt("New output name (without extension)")
      if (newName) setOutputName(newName)
    }

    window.addEventListener("keypress", handleKeypress)
    return () => window.removeEventListener("keypress", handleKeypress)
  }, [])

  const cliCode = `
    ffmpeg \\
      -i '${input}' \\
      -ss ${encodeTimeToString(startTime ?? 0)} \\
      -to ${encodeTimeToString(endTime ?? 0)} \\
      -c copy \\
      '${outputName}${outputExtension && `.${outputExtension}`}'
  `
    .trim() // trim all the spaces around the code
    .replace(/ {2,}/g, "  ") // change the indentation for 2 spaces only

  const copyCliCode = useCallback(() => navigator.clipboard.writeText(cliCode), [cliCode])

  // Allow to copy the code by pressing "cmd+C" or "ctrl+C"
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const modifierPressed = isMacos(navigator.userAgent) ? e.metaKey : e.ctrlKey
      if (modifierPressed && e.code === "KeyC") {
        copyCliCode()
      }
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [copyCliCode])

  return (
    <Layout>
      <CopyButton onClick={copyCliCode} />
      <Code dangerouslySetInnerHTML={{ __html: cliCode }} />
    </Layout>
  )
}
