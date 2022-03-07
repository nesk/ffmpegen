import { FfmpegCommand } from "../FfmpegCommand"
import { encodeTimeToString } from "./TimeEncoder"

export const encodeCommandToString = (command: FfmpegCommand) => {
  return `
    ffmpeg \\
      -i '${command.input}' \\
      -ss ${encodeTimeToString(command.cutStart ?? 0)} \\
      -to ${encodeTimeToString(command.cutEnd ?? 0)} \\
      -c copy \\
      '${command.output}'
  `
    .trim() // trim all the spaces around the code
    .replace(/^ +/gm, "  ") // change the indentation for 2 spaces only
}
