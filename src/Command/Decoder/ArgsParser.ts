export class Value {
  readonly value: string

  constructor(value: string) {
    this.value = value
  }
}

export class Option {
  readonly name: string
  readonly value: string

  constructor(name: string, value: string = "") {
    this.name = name.replace(/^-*(.*)/g, "$1")
    this.value = value
  }
}

/**
 * Parses arguments and keeps their order.
 */
export const parseArgs = (args: string[]) => {
  const config: (Value | Option)[] = []
  let pendingOption: string | undefined

  for (const arg of args) {
    if (arg.startsWith("-")) {
      if (pendingOption) {
        config.push(new Option(pendingOption))
        pendingOption = undefined
      }

      pendingOption = arg
    } else if (pendingOption) {
      config.push(new Option(pendingOption, arg))
      pendingOption = undefined
    } else {
      config.push(new Value(arg))
    }
  }

  if (pendingOption) {
    config.push(new Option(pendingOption))
  }

  return config
}
