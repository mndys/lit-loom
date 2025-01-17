import chalk from 'chalk'

// colored log messages
export const logError = (errorMessage: string, error?: Error): void => {
  console.error(chalk.red(`\n↪️ ${errorMessage}\n`), error?.message)
}

export const logMessage = (message: string): void =>
  console.log(chalk.green(`\n↪️ ${message}\n`))

export const logWarn = (warnMessage: string): void =>
  console.warn(chalk.yellow(`\n↪️ ${warnMessage}\n`))
