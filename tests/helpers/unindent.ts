/**
 * Remove the common indentation from a multiline template literal.
 */
export function unindent(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  const source = strings.reduce(
    (result, part, index) => result + String(values[index - 1] ?? '') + part,
  )
  const lines = source
    .replace(/^\n/, '')
    .replace(/\n\s*$/, '')
    .split('\n')
  const indents = lines
    .filter(line => line.trim())
    .map(line => line.match(/^\s*/)?.[0].length ?? 0)
  const indentation = Math.min(...indents)

  return lines.map(line => line.slice(indentation)).join('\n')
}
