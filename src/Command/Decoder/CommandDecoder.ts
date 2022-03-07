import parseShell from "shell-parser"
import { createFfmpegCommand } from "../FfmpegCommand"
import { Option, parseArgs } from "./ArgsParser"
import { decodeTimeFromString } from "./TimeDecoder"

export const decodeCommandFromString = (string: string) => {
  const shellParts = parseShell(string)
  const config = parseArgs(shellParts)

  return createFfmpegCommand(builder => {
    for (const row of config) {
      if (row instanceof Option) {
        switch (row.name) {
          case "i":
            builder.setInput(row.value)
            break
          case "ss":
            builder.setCutStart(decodeTimeFromString(row.value))
            break
          case "to":
            builder.setCutEnd(decodeTimeFromString(row.value))
        }
      } else {
        builder.setOutput(row.value)
      }
    }
  })
}
