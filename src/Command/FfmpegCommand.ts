// https://ffmpeg.org/ffmpeg.html

import { decodeTimeFromString } from "./Decoder/TimeDecoder"
import { Seconds, Time } from "./Time"

type FilePath = string

interface CommandBuilder {
  setInput(filePath: FilePath): CommandBuilder
  setOutput(filePath: FilePath): CommandBuilder
  setCutStart(time: Time): CommandBuilder
  setCutEnd(time: Time): CommandBuilder
  build(): FfmpegCommand
}

type BuilderOperation = (command: FfmpegCommand) => void

export class FfmpegCommand {
  input?: FilePath
  output?: FilePath
  cutStart?: Seconds
  cutEnd?: Seconds

  private constructor() {}

  static Builder = class Builder implements CommandBuilder {
    #operations: BuilderOperation[] = []

    private addOperation(operation: BuilderOperation) {
      this.#operations.push(operation)
      return this
    }

    setInput = (filePath: FilePath) => this.addOperation(command => (command.input = filePath))
    setOutput = (filePath: FilePath) => this.addOperation(command => (command.output = filePath))
    setCutStart = (time: Time) => this.addOperation(command => (command.cutStart = decodeTimeFromString(String(time))))
    setCutEnd = (time: Time) => this.addOperation(command => (command.cutEnd = decodeTimeFromString(String(time))))

    build() {
      const command = new FfmpegCommand()
      for (const applyOperation of this.#operations) {
        applyOperation(command)
      }
      return Object.freeze(command)
    }
  }
}

type Composer = (builder: CommandBuilder) => void

export const createFfmpegCommand = (composer: Composer) => {
  const builder = new FfmpegCommand.Builder()
  composer(builder)
  return builder.build()
}
