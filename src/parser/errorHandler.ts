/**
 * Error handling for parser
 */

import type { ErrorContext, ParseError, ParseErrorType } from '../types/errors'

export class ErrorHandler implements ErrorContext {
  errors: ParseError[] = []
  warnings: ParseError[] = []

  addError(error: Omit<ParseError, 'type'> & { type: ParseErrorType }): void {
    this.errors.push(error as ParseError)
  }

  addWarning(
    warning: Omit<ParseError, 'type'> & { type: ParseErrorType },
  ): void {
    this.warnings.push(warning as ParseError)
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0
  }

  clear(): void {
    this.errors = []
    this.warnings = []
  }

  getErrors(): ParseError[] {
    return [...this.errors]
  }

  getWarnings(): ParseError[] {
    return [...this.warnings]
  }

  /**
   * Merge errors from another ErrorHandler
   */
  mergeErrors(other: ErrorHandler): void {
    this.errors.push(...other.errors)
    this.warnings.push(...other.warnings)
  }

  /**
   * Get all issues (errors + warnings) sorted by position
   */
  getAllIssues(): ParseError[] {
    return [...this.errors, ...this.warnings].sort((a, b) => {
      return a.range[0] - b.range[0]
    })
  }

  /**
   * Format errors for display
   */
  format(): string {
    const issues = this.getAllIssues()
    if (issues.length === 0) {
      return 'No errors or warnings'
    }

    return issues
      .map(issue => {
        const { loc, message, type } = issue
        return `${loc.start.line}:${loc.start.column} [${type}] ${message}`
      })
      .join('\n')
  }
}
