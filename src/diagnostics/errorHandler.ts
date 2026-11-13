/**
 * Error handling for parser
 */

import { sortDiagnostics } from './sortDiagnostics'
import type { ErrorContext, ParseDiagnostic, ParseErrorType } from './types'

/**
 * Collects recoverable parse errors and warnings during parsing.
 */
export class ErrorHandler implements ErrorContext {
  errors: ParseDiagnostic[] = []
  warnings: ParseDiagnostic[] = []

  addError(error: Omit<ParseDiagnostic, 'type'> & { type: ParseErrorType }) {
    this.errors.push(error as ParseDiagnostic)
  }

  addWarning(
    warning: Omit<ParseDiagnostic, 'type'> & { type: ParseErrorType },
  ) {
    this.warnings.push(warning as ParseDiagnostic)
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0
  }

  clear() {
    this.errors = []
    this.warnings = []
  }

  getErrors(): ParseDiagnostic[] {
    return sortDiagnostics(this.errors)
  }

  getWarnings(): ParseDiagnostic[] {
    return sortDiagnostics(this.warnings)
  }

  /**
   * Merge errors from another ErrorHandler
   */
  mergeErrors(other: ErrorHandler) {
    this.errors.push(...other.errors)
    this.warnings.push(...other.warnings)
  }

  /**
   * Get all issues (errors + warnings) sorted by position
   */
  getAllIssues(): ParseDiagnostic[] {
    return sortDiagnostics([...this.errors, ...this.warnings])
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
