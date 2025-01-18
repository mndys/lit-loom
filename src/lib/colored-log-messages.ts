import chalk from 'chalk'

// colored log messages
export const logError = (errorMessage: string, error?: Error): void => {
  console.error(chalk.red(`\n↪️ ${errorMessage}`), error?.message)
}

export const logMessage = (message: string): void =>
  console.log(chalk.green(`\n↪️ ${message}`))

export const logWarn = (warnMessage: string): void =>
  console.warn(chalk.yellow(`\n↪️ ${warnMessage}`))

export const logSpecial = (warnMessage: string): void =>
  console.log(chalk.magenta(`\n↪️ ${warnMessage}`))
